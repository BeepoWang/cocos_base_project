import { _decorator, Component, Node, UITransform, Input, EventTouch, Touch, input, EventMouse } from 'cc';
import { EventDefine } from '../../config';
import eventManager from '../../core/common/event-bus/event-manager';
const { ccclass, property } = _decorator;

@ccclass('joystick')
export class joystick extends Component {
    @property({ type: Node, tooltip: '相机控制区域' })
    camera_ctrl: Node;

    @property({ type: Node, tooltip: '摇杆控制区域' })
    joystick_ctrl: Node;

    @property({ type: Node, tooltip: '摇杆节点' })
    rocking: Node;

    @property({ type: Node, tooltip: '触摸跟随点' })
    pointer: Node;

    private joystickCtrlUIT: UITransform = null;
    private cameraCtrlUIT: UITransform = null;
    private rockingUIT: UITransform = null;

    private currentTouch: Touch = null;
    private cameraTouchA: Touch = null
    private cameraTouchB: Touch = null

    private distanceOfTwoTouchPoint: number = 0
    private cameraSensitivity: number = 0.1;

    // 生命周期，初始化监听事件
    start() {
        // 摇杆操作区，事件监听
        this.joystickCtrlUIT = this.joystick_ctrl.getComponent(UITransform);
        this.joystickCtrlUIT.node.on(Input.EventType.TOUCH_START, this.onTouchStart_JoystickCtrl, this);
        this.joystickCtrlUIT.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove_JoystickCtrl, this);
        this.joystickCtrlUIT.node.on(Input.EventType.TOUCH_END, this.onTouchEnd_JoystickCtrl, this);
        this.joystickCtrlUIT.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd_JoystickCtrl, this);

        // 相机控制区域，事件监听
        this.cameraCtrlUIT = this.camera_ctrl.getComponent(UITransform);
        this.cameraCtrlUIT.node.on(Input.EventType.TOUCH_START, this.onTouchStart_CameraCtrl, this);
        this.cameraCtrlUIT.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove_CameraCtrl, this);
        this.cameraCtrlUIT.node.on(Input.EventType.TOUCH_END, this.onTouchEnd_CameraCtrl, this);
        this.cameraCtrlUIT.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd_CameraCtrl, this);

        this.rockingUIT = this.rocking.getComponent(UITransform);
        this.rockingUIT.node.active = false;

        input.on(Input.EventType.MOUSE_WHEEL, this.mouseWheel, this)
    }

    // 摇杆区域的触摸开始事件处理函数
    private onTouchStart_JoystickCtrl(event: EventTouch) {
        let touches = event.getTouches();
        if (touches.length <= 0) return;

        const touch = touches[0];
        let x = touch.getUILocationX();
        let y = touch.getUILocationY();
        let halfWidth = this.cameraCtrlUIT.width / 2;
        let halfHeight = this.cameraCtrlUIT.height / 2;

        if (!this.currentTouch) {
            // 激活摇杆节点，设置位置和触摸跟随点的位置
            this.rockingUIT.node.active = true;
            this.rockingUIT.node.setPosition(x - halfWidth, y - halfHeight, 0);
            this.pointer.setPosition(0, 0, 0);
            this.currentTouch = touch;
        }
    }
    // 摇杆区域的触摸移动事件处理函数
    private onTouchMove_JoystickCtrl(event: EventTouch) {
        let touches = event.getTouches();
        if (touches.length === 0) return;

        for (let i = 0; i < touches.length; ++i) {
            const touch = touches[i];
            if (this.currentTouch && this.currentTouch.getID() === touch.getID()) {
                const { x: ctrlX, y: ctrlY } = touch.getUILocation();
                const { width: ctrlWidth, height: ctrlHeight } = this.cameraCtrlUIT;
                const { x: pointerX, y: pointerY } = this.rockingUIT.node.position;
                const { width: rockingWidth } = this.rockingUIT;
                // 计算触摸点相对于触摸跟随点的偏移量和距离
                const ox = ctrlX - ctrlWidth / 2 - pointerX;
                const oy = ctrlY - ctrlHeight / 2 - pointerY;
                let distance = Math.sqrt(ox * ox + oy * oy);
                if (distance <= 0) return;
                // 计算指针位置
                const radius = rockingWidth / 2;
                const ratio = Math.min(distance / radius, 1);
                const dx = (ox / distance) * ratio * radius;
                const dy = (oy / distance) * ratio * radius;
                this.pointer.setPosition(dx, dy, 0);
                // 计算指针角度
                let degree = (Math.atan2(dy, dx) / Math.PI) * 180;
                degree += dx < 0 ? 180 : 540;
                degree %= 360;
                eventManager.emit(EventDefine.JoystickEvent.Move, { degree, distance, radius })
            }
        }
    }
    private onTouchEnd_JoystickCtrl(event: EventTouch) {
        if (event.getID() === this.currentTouch?.getID()) {
            eventManager.emit(EventDefine.JoystickEvent.Move_Stop)
            this.currentTouch = null;
            this.rockingUIT.node.active = false;
        }
    }

    private onTouchStart_CameraCtrl(event: EventTouch) {
        let touches = event.getAllTouches();
        this.cameraTouchA = touches.shift() || null;
        this.cameraTouchB = touches.shift() || null;
        this.distanceOfTwoTouchPoint = this.getDistOfTwoTouchPoints(this.cameraTouchA, this.cameraTouchB);
    }

    private onTouchMove_CameraCtrl(event: EventTouch) {

        const touches = event.getTouches();
        let needZoom = false;
        let needRotate = false;
        let touchA, touchB;
        for (let i = 0; i < touches.length; ++i) {
            const touch = touches[i];
            switch (touch.getID()) {
                case this.cameraTouchA?.getID():
                    needRotate = true;
                    touchA = touch;
                    break;
                case this.cameraTouchB?.getID():
                    needZoom = true;
                    touchB = touch;
                    break;
                default:
                    break;
            }
        }

        if (needZoom && touchA && touchB) {
            const newDist = this.getDistOfTwoTouchPoints(touchA, touchB);
            const delta = this.distanceOfTwoTouchPoint - newDist;
            eventManager.emit(EventDefine.JoystickEvent.Zoom, delta)
            this.distanceOfTwoTouchPoint = newDist;
        }

        if (needRotate && touchA) {
            const dt = touchA.getDelta();
            const rx = dt.y * this.cameraSensitivity;
            const ry = -dt.x * this.cameraSensitivity;

            eventManager.emit(EventDefine.JoystickEvent.Rotate, { rx, ry })
        }
    }
    private onTouchEnd_CameraCtrl(event: EventTouch) {
        let touches = event.getAllTouches();
        let touchAIndex = touches.findIndex(touch => touch.getID() === this.cameraTouchA?.getID());
        let touchBIndex = touches.findIndex(touch => touch.getID() === this.cameraTouchB?.getID());
        if (touchAIndex === -1) {
            this.cameraTouchA = null;
        }
        if (touchBIndex === -1) {
            this.cameraTouchB = null;
        }
    }

    private getDistOfTwoTouchPoints(touchA: Touch, touchB: Touch): number {
        if (!touchA || !touchB) {
            return 0;
        }
        let dx = touchA.getLocationX() - touchB.getLocationX();
        let dy = touchB.getLocationY() - touchB.getLocationY();
        return Math.sqrt(dx * dx + dy * dy);
    }

    private mouseWheel(event: EventMouse) {
        let delta = event.getScrollY() * 0.1
        eventManager.emit(EventDefine.JoystickEvent.Zoom, delta)
    }
}

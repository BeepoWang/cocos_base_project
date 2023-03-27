import { _decorator, Component, Node, CCFloat, Vec3, v3, misc } from 'cc';
import { EventDefine } from '../../config';
import eventManager from '../../core/common/event-bus/event-manager';
const { ccclass, property } = _decorator;


const ROTATION_STRENGTH = 20.0
const v3_1 = v3()
const V3_2 = v3()

@ccclass('third_person_camera')
export class ThirdPersonCamera extends Component {

    @property({ type: Node, tooltip: '' })
    target: Node = null

    @property({ type: Vec3, tooltip: '' })
    lookAtOffset: Vec3 = v3()

    @property({ type: Boolean, tooltip: '' })
    rotateVHSeparately: boolean = false

    @property({ type: CCFloat, tooltip: '' })
    zoomSensitivity: number = 1.0

    @property({ type: CCFloat, tooltip: '' })
    distance: number = 5

    @property({ type: CCFloat, tooltip: '' })
    minDistance: number = 1.0

    @property({ type: CCFloat, tooltip: '' })
    maxDistance: number = 5.0

    @property({ type: CCFloat, tooltip: '' })
    tweenTime: number = 0.2


    private targetAngles: Vec3 = v3()
    private targetDistance: number = 0

    start() {
        eventManager.on(EventDefine.JoystickEvent.Rotate, this.cameraRotate, this)
        // eventManager.on(EventDefine.JoystickEvent.Zoom, this.cameraZoom, this)
    }

    onDestory() {
        eventManager.off(EventDefine.JoystickEvent.Rotate, this.cameraRotate, this)
        // eventManager.off(EventDefine.JoystickEvent.Zoom, this.cameraZoom, this)
    }

    lateUpdate(deltaTime: number) {
        if (!this.target) return;


        const t = Math.min(deltaTime / this.tweenTime, 1.0)

        this.node.eulerAngles.lerp( this.targetAngles, t)

        v3_1.set(this.target.worldPosition)
        v3_1.add(this.lookAtOffset)

        this.distance = this.distance * (1.0 - t) + this.targetDistance * t

        Vec3.scaleAndAdd(v3_1, v3_1, this.node.forward, -this.distance)
        this.node.setPosition(v3_1)
    }

    private cameraRotate(data: Record<string, any>[]) {
        let { rx: deltaX, ry: deltaY } = data[0]
        console.log('deltaX', deltaX, deltaY);
        if (this.rotateVHSeparately) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0
            } else {
                deltaX = 0
            }
        }
        const eulerAngles = this.node.eulerAngles
        this.targetAngles.set(
            eulerAngles.x + deltaX * ROTATION_STRENGTH,
            eulerAngles.y + deltaY * ROTATION_STRENGTH,
            eulerAngles.z
        )
    }

    private cameraZoom(data) {
        const delta = data[0]
        this.targetDistance += delta * this.zoomSensitivity
        this.targetDistance = Math.min(Math.max(this.targetDistance, this.minDistance), this.maxDistance)
    }
}




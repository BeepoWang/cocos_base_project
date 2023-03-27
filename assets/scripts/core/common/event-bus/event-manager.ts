
interface EventItem {
  handler: Function
  content?: any
}

class EventManager {

  private _eventMap: Map<string, EventItem[]> = new Map()
  /**
   * 添加事件订阅
   * @param eventName 事件名称
   * @param func 事件函数
   * @param ctx 执行上下文
   */
  public on(eventName: string, handler: Function, content?: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).push({ handler, content })
    } else {
      this._eventMap.set(eventName, [{ handler, content }])
    }
  }

  /**
   * 取消事件订阅
   * @param eventName 事件名称
   * @param func 事件函数
   */
  public off(eventName: string, handler: Function, content?: any) {
    if (!this._eventMap.has(eventName)) return
    const index = this._eventMap
      .get(eventName)
      .findIndex(i => i.handler === handler && i.content === content);
    if (index) {
      this._eventMap.get(eventName).splice(index, 1)
    }
  }

  /**
  * 发布事件
  * @param eventName 事件名称
  * @param params 事件参数
  */
  public emit(eventName: string, ...params: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).forEach(({ handler, content }) => {
        content ? handler.apply(content, params) : handler(...params)
      })
    }
  }
}

/**
 * 这里使用了工厂类 EventManagerFactory 来创建单例的事件总线对象 EventManager。
 * 工厂类只负责创建对象，而事件总线对象 EventManager 则负责处理事件的订阅、发布和取消订阅等功能。
 * 客户端代码通过调用 EventManagerFactory.getInstance() 方法来获取 EventManager 对象的实例。
 * 由于工厂类只创建一个事件总线对象，所以该事件总线对象也是一个全局单例对象。
 */

class EventManagerFactory {
  private static instance: EventManager

  static getInstance() {
    if (!EventManagerFactory.instance) {
      EventManagerFactory.instance = new EventManager()
    }
    return EventManagerFactory.instance
  }
}

const eventManager = EventManagerFactory.getInstance()

export default eventManager
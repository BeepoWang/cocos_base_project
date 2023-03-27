type EventHandler<T> = (data: T) => any;

interface EventItem<T> {
  handler: EventHandler<T>
  content?: any
}

class EventManager {

  private _eventMap: Map<string, EventItem<unknown>[]> = new Map()

  public on<T>(eventName: string, handler: EventHandler<T>, content?: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).push({ handler, content })
    } else {
      this._eventMap.set(eventName, [{ handler, content }])
    }
  }

  public off<T>(eventName: string, handler: EventHandler<T>, content?: any) {
    if (!this._eventMap.has(eventName)) return
    const index = this._eventMap
      .get(eventName)
      .findIndex(i => i.handler === handler && i.content === content);
    if (index) {
      this._eventMap.get(eventName).splice(index, 1)
    }
  }

  public emit<T = Record<string, any>>(eventName: string, data?: T, content?: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).forEach(({ handler, content: ctx }) => {
        content ? handler.apply(content, [data]) : handler([data])
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
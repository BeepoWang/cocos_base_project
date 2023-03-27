## 系统使用设计模式说明

### 单例类

- 说明
  单例类是一种设计模式，用于限制一个类仅能被实例化一次，并提供一个全局访问点来访问这个实例。在单例类中，通过把构造函数设为私有，使得该类不能被直接实例化，而是通过一个静态方法来获取（或创建）唯一的实例。

  在实现单例类时，需要考虑多线程访问的问题，因为多个线程同时调用获取实例的方法可能会导致创建多个实例。因此通常需要对获取实例的方法进行同步或使用双重检查锁定等方式来保证线程安全。

  单例类可以用于管理全局的状态或资源，比如数据库连接池、配置管理器、日志管理器等。它们可以在系统启动时初始化，并保持在整个生命周期中存在，以提供高效的全局访问。

- 定义 单例类基类（singleton）

```ts
// Singleton类的定义
export class Singleton {
  // 私有静态变量，用于存储单例实例
  private static _instance: any = null;

  // 声明一个受保护的构造函数，用于防止直接实例化该类。
  protected constructor() {}

  //声明一个公有静态方法 getInstance，用于获取单例实例。返回类型为 T，即泛型。
  public static getInstance<T>(): T {
    // 如果单例实例不存在，创建一个新实例
    if (!this._instance) {
      this._instance = new this();
    }
    // 返回单例实例
    return this._instance;
  }
}
```

- 项目中使用单例模式

1. 全局数据中心（DataManager）

```ts
import Singleton from 'xxx/xx/Singleton.ts';

export class DataManager extends Singleton {
  public static get Instance() {
    return super.getInstance<DataManager>();
  }

  // ......
}
```

2. 全局缓存中心 （ResCacheManager）

```ts
import Singleton from 'xxx/xx/Singleton.ts';
export class ResCacheManager extends Singleton {
  public static get Instance() {
    return super.getInstance<ResCacheManager>();
  }

  // ......
}
```

### 订阅发布模式

- 说明

  订阅发布者模式是一种软件设计模式，用于实现组件之间的松散耦合。在该模式中，有两个重要的组件：订阅者和发布者。

  发布者是负责发布消息或事件的组件。它将消息发布到一个或多个主题，而主题则是消息的分类或者类型。

  订阅者则是对特定主题感兴趣的组件，它们订阅或者注册在特定的主题上，以接收发布者发布的消息或事件

- 项目中定义全局事件总线,

```ts
type EventHandler<T> = (data: T) => void;

interface EventItem<T> {
  handler: EventHandler<T>;
  content?: any;
}

class EventManager {
  private _eventMap: Map<string, EventItem<unknown>[]> = new Map();

  public on<T>(eventName: string, handler: EventHandler<T>, content?: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).push({ handler, content });
    } else {
      this._eventMap.set(eventName, [{ handler, content }]);
    }
  }

  public off<T>(eventName: string, handler: EventHandler<T>, content?: any) {
    if (!this._eventMap.has(eventName)) return;
    const index = this._eventMap
      .get(eventName)
      .findIndex((i) => i.handler === handler && i.content === content);
    if (index) {
      this._eventMap.get(eventName).splice(index, 1);
    }
  }

  public emit<T>(eventName: string, data?: T, content?: any) {
    if (this._eventMap.has(eventName)) {
      this._eventMap.get(eventName).forEach(({ handler, content }) => {
        content ? handler.apply(content, data) : handler(data);
      });
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
  private static instance: EventManager;

  static getInstance() {
    if (!EventManagerFactory.instance) {
      EventManagerFactory.instance = new EventManager();
    }
    return EventManagerFactory.instance;
  }
}

const eventManager = EventManagerFactory.getInstance();

export default eventManager;
```

- 使用范例

```ts
import EventManager from '*/**/EventManager';

// 定义事件名称
const EVENT_NAME = 'rotation';

// 在 ComponentA 中订阅事件
eventManager.on(EVENT_NAME, (data: string) => {
  console.log(`ComponentA received data: ${data}`);
});

// 在 ComponentB 中订阅事件
eventManager.on(EVENT_NAME, (data: string) => {
  console.log(`ComponentB received data: ${data}`);
});

// 在 ComponentB 中发布事件
const data = 'hello world';
eventManager.emit(EVENT_NAME, data);
```

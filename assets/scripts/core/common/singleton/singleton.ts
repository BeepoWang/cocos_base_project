export class Singleton {
  // 私有静态变量，用于存储单例实例
  private static _instance: any = null;

  // 声明一个受保护的构造函数，用于防止直接实例化该类。
  protected constructor() { }

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
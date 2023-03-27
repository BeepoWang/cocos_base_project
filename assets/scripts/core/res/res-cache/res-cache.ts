import { AudioClip, JsonAsset, Prefab, SpriteFrame } from "cc";
import { EventDefine } from "../../../config";
import eventManager from "../../common/event-bus/event-manager";
import { Res } from "../res-load/res-load";
import { Singleton } from "../../common/singleton/singleton";

export class ResCache extends Singleton {

  public static get Instance() {
    return super.getInstance<ResCache>()
  }

  private _json: Map<string, JsonAsset> = new Map()
  private _prefab: Map<string, Prefab> = new Map()
  private _sound: Map<string, AudioClip> = new Map()
  private _sprite: Map<string, SpriteFrame> = new Map()
  private _callback: Function | undefined

  public loadMsg: Record<string, any> = {}


  public async load(callback: Function) {
    this._callback = callback
    eventManager.on(EventDefine.ResLoadEvent.Load_End, this.checkResLoadEnd.bind(this))

    Res.loadJson('data/data-res-cache', async (err, asset) => {
      if (err) {
        console.error('Load Cache res Error', err);
        return
      }

      this.loadMsg = {
        wait_count: 1,
        count: 1
      }

      if (!asset || !asset.json) {
        console.error('resource cache data is null', asset);
      }

      asset.json['prefab'] && ResCache.Instance.loadPrefab(asset.json['prefab']);
      asset.json['json'] && ResCache.Instance.loadJson(asset.json['json']);
      asset.json['sprite'] && ResCache.Instance.loadSprite(asset.json['sprite']);
      asset.json['sound'] && ResCache.Instance.loadSound(asset.json['sound']);

      eventManager.emit(EventDefine.LoadingEvent.Loading)
    })
  }

  public addLoad() {
    this.loadMsg!.wait_count++;
    this.loadMsg!.count++;
  }

  public removeLoad() {
    this.loadMsg!.wait_count--;
  }

  public checkResLoadEnd() {
    if (this._callback) {
      if (Res.count <= 0) {
        this._callback()
        this._callback = undefined
      }
    }
  }


  // 预制体数据加载/读取
  public loadPrefab(paths: string[]) {
    paths.forEach(item => {
      this.addLoad()
      Res.loadDirPrefab(item, (err, asset) => {
        console.log('loadDirPrefab asset', asset);

        if (asset) {
          ResCache.Instance.setPrefab(asset)
          this.removeLoad()
        }
      })
    })
  }
  public setPrefab(asset: any[]) {
    asset.forEach(item => {
      this._prefab.set(item.name, item)
    })
  }
  public getPrefab(name: string) {
    if (this._prefab.has(name)) {
      return this._prefab.get(name)
    } else {
      console.error('Res cache not found Prefab res：', name)
      return undefined
    }
  }

  // 音频数据加载/读取
  public loadSound(paths: string[]) {
    paths.forEach(item => {
      this.addLoad()
      Res.loadDirSound(item, (err, asset) => {
        if (asset) {
          ResCache.Instance.setSound(asset)
          this.removeLoad()
        }
      })
    });
  }
  public getSound(name: string) {
    if (this._sound.has(name)) {
      return this._sound.get(name)
    } else {
      console.error('Res cache not find Sound res:', name);
    }
  }
  public setSound(asset: any[]) {
    asset.forEach(item => {
      this._sound.set(item.name, item)
    })
  }

  // 精灵图资源加载/读取
  public loadSprite(paths: string[]) {
    paths.forEach(item => {
      this.addLoad()
      Res.loadDirSprite(item, (err, asset) => {
        if (asset) {
          ResCache.Instance.setSprite(asset)
          this.removeLoad()
        }
      })
    })
  }
  public setSprite(asset: any[]) {
    asset.forEach(item => {
      this._sprite.set(item.name, item)
    })
  }
  public getSprite(name: string) {
    if (this._sprite.has(name)) {
      return this._sprite.get(name)
    } else {
      console.error('Res cache not find Sprite res:', name);
    }
  }


  // JSON数据加载/读取
  public loadJson(paths: []) {
    paths.forEach(item => {
      this.addLoad()
      Res.loadDirJson(item, (err, asset) => {
        if (asset) {
          ResCache.Instance.setJson(asset)
          this.removeLoad()
        }
      })
    })
  }
  public setJson(asset: any[]) {
    asset.forEach(item => {
      this._json.set(item.name, item)
    })
  }
  public getJSON(name: string) {
    if (this._json.get(name)) {
      return this._json.get(name)
    } else {
      console.error('Res cache not found JSON res：', name)
      return null
    }
  }
}
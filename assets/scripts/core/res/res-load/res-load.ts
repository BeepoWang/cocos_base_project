import { AnimationClip, Asset, AudioClip, Constructor, Node, director, error, ImageAsset, instantiate, JsonAsset, Material, Mesh, Prefab, resources, Skeleton, SpriteAtlas, SpriteFrame, TextAsset, Texture2D, Vec3 } from "cc";
import { EventDefine } from "../../../config";
import eventManager from "../../common/event-bus/event-manager";


export class Res {
  public static count: number = 0

  /**
   * 加载资源 
   * @param path 相对分包文件夹路径的相对路径
   * @param type 资源类型
   * @param [callback] 资源加载回掉函数
   */
  public static load<T extends Asset>(path: string, type: Constructor<T>, callback?: (err: Error | null, asset?: T | null) => void) {
    this.count++
    resources.load(path, type, function (err, res) {
      if (err) {
        error(path, err.message || err)
        eventManager.emit(EventDefine.ResLoadEvent.Load_Err)
      }
      if (callback) {
        callback(err, res)
      }
      Res.count--
      eventManager.emit(EventDefine.ResLoadEvent.Load_End)
    })
  }

  /**
   * 从 Prefab 实例化出新节点
   * @param asset 资源文件
   * @param root 挂在节点
   * @param pos 位置
   * @returns 
   */
  public static inst(asset: Prefab, root: Node | undefined = undefined, pos: Vec3 = Vec3.ZERO): Node {
    const instObj = instantiate(asset)
    if (root === undefined) {
      director.getScene()?.addChild(instObj)
    } else {
      instObj.setParent(root)
    }
    instObj.setPosition(pos)
    instObj.setScale(Vec3.ONE)

    return instObj
  }

  /**
   * 克隆指定的任意类型的对象
   * @param node 节点Node
   * @param root 挂载节点
   * @param pos 位置
   * @returns 
   */
  public static instNode(node: Node, root: Node | undefined = undefined, pos: Vec3 = Vec3.ZERO): Node {
    const instObj = instantiate(node);
    if (root === undefined) {
      director.getScene()?.addChild(instObj);
    } else {
      instObj.setParent(root);
    }
    instObj.setPosition(pos);
    instObj.setScale(Vec3.ONE);

    return instObj
  }

  /**
   * 加载目标文件夹中的所有资源
   * @param path 路径
   * @param type 资源类型
   * @param [cb] 
   */
  public static loadDir<T extends Asset>(path: string, type: Constructor<T> | null, cb?: (err: Error | null, asset?: T[] | null) => void) {
    this.count++;
    resources.loadDir(path, type, function (err, res) {
      if (err) {
        error(err.message || err);
        eventManager.emit(EventDefine.ResLoadEvent.Load_Err);
      }
      if (cb) {
        cb(err, res);
      }
      Res.count--;
      eventManager.emit(EventDefine.ResLoadEvent.Load_End);
    });
  }

  // 封装常用资源类型的加载
  public static loadPrefab(path: string, cb?: (err: Error | null, asset?: Prefab | null) => void) {
    this.load(path, Prefab, cb);
  }

  public static loadJson(path: string, cb?: (err: Error | null, asset?: JsonAsset | null) => void) {
    this.load(path, JsonAsset, cb)
  }

  public static loadTxt(path: string, cb?: (err: Error | null, asset?: TextAsset | null) => void) {
    this.load(path, TextAsset, cb)
  }

  public static loadTex2D(path: string, cb?: (err: Error | null, asset?: Texture2D | null) => void) {
    this.load(path, Texture2D, cb);
  }

  public static loadImage(path: string, cb?: (err: Error | null, asset?: ImageAsset | null) => void) {
    this.load(path, ImageAsset, cb);
  }

  public static loadSprite(path: string, cb?: (err: Error | null, asset?: SpriteFrame | null) => void) {
    this.load(path, SpriteFrame, cb);
  }

  public static loadSpriteAtlas(path: string, cb?: (err: Error | null, asset?: SpriteAtlas | null) => void) {
    this.load(path, SpriteAtlas, cb);
  }

  public static loadAudio(path: string, cb?: (err: Error | null, asset?: AudioClip | null) => void) {
    this.load(path, AudioClip, cb);
  }

  public static loadAnimationClip(path: string, cb?: (err: Error | null, asset?: AnimationClip | null) => void) {
    this.load(path, AnimationClip, cb);
  }

  public static loadMesh(path: string, cb?: (err: Error | null, asset?: Mesh | null) => void) {
    this.load(path, Mesh, cb);
  }

  public static loadMaterial(path: string, cb?: (err: Error | null, asset?: Material | null) => void) {
    this.load(path, Material, cb);
  }

  public static loadSkeleton(path: string, cb?: (err: Error | null, asset?: Skeleton | null) => void) {
    this.load(path, Skeleton, cb);
  }

  public static loadDirJson(path: string, cb?: (err: Error | null, asset?: JsonAsset[] | null) => void) {
    this.loadDir(path, JsonAsset, cb);
  }

  // 封装常用资源  文件夹加载

  public static loadDirPrefab(path: string, cb?: (err: Error | null, asset?: Prefab[] | null) => void) {
    this.loadDir(path, Prefab, cb);
  }

  public static loadDirText(path: string, cb?: (err: Error | null, asset?: TextAsset[] | null) => void) {
    this.loadDir(path, TextAsset, cb);
  }

  public static loadDirSprite(path: string, cb?: (err: Error | null, asset?: SpriteFrame[] | null) => void) {
    this.loadDir(path, SpriteFrame, cb);
  }

  public static loadDirSound(path: string, cb?: (err: Error | null, asset?: AudioClip[] | null) => void) {
    this.loadDir(path, AudioClip, cb);
  }

}
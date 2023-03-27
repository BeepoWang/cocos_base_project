## 项目资源预加载与资源缓存

#### 资源加载方法封装 （Res）

- 创建 Res 类，主要提供资源的加载、实例化、克隆和封装常用资源类型的加载。在资源加载过程中，还会统计当前加载中的资源数量(count)和资源加载完成的事件派发。

- 基础方法

  - `load(path, type, callback)`: 加载指定路径的资源文件，返回资源对象。其中，path 为相对分包文件夹路径的相对路径，- type 为资源类型，callback 为加载回调函数。

  - `inst(asset, root, pos)`: 从 Prefab 资源文件实例化出新节点。其中，asset 为资源文件，root 为挂载节点，pos 为位置。

  - `instNode(node, root, pos)`: 克隆指定的任意类型的节点。其中，node 为节点 Node，root 为挂载节点，pos 为位置。

  - `loadDir(path, type, cb)`: 加载目标文件夹中的所有资源，返回资源数组。其中，path 为路径，type 为资源类型，cb 为加载- 回调函数。

- 针对不同资源类型的加载/实例化方法

  - `loadPrefab(path, cb)`: 封装常用 Prefab 类型资源的加载。

  - `loadJson(path, cb)`: 封装常用 JsonAsset 类型资源的加载。

  - `loadTxt(path, cb)`: 封装常用 TextAsset 类型资源的加载。

  - `loadTex2D(path, cb)`: 封装常用 Texture2D 类型资源的加载。

  - `loadImage(path, cb)`: 封装常用 ImageAsset 类型资源的加载。

  - `loadSprite(path, cb)`: 封装常用 SpriteFrame 类型资源的加载。

  - `loadSpriteAtlas(path, cb)`: 封装常用 SpriteAtlas 类型资源的加载。

  - `loadAudio(path, cb)`: 封装常用 AudioClip 类型资源的加载。

  - `loadAnimationClip(path, cb)`: 封装常用 AnimationClip 类型资源的加载。

  - `loadMesh(path, cb)`: 封装常用 Mesh 类型资源的加载。

  - `loadMaterial(path, cb)`: 封装常用 Material 类型资源的加载。

- 资源加载完成事件派发
  使用全局事件总线（EventManager）派发 `Res_Load_End` 事件

#### 全局资源缓存管理 （ResCacheManager）

- 创建`data-res-cache/json`文件，记录需要缓存的资源文件地址( `resources` 目录)

```json
// data/data-res-cache.json
{
  "json": ["data"],
  "prefab": ["prefab/ui", "prefab/character"],
  "sprite": ["icons"],
  "sound": ["sound"]
}
```

- 用来 加载、读取 缓存在全局中使用到的 预制体(Prefab)、音频(Sounds)、JSON 数据、精灵图(Sprite) 等资源文件

1. 公用方法

- `load(callback: Function)`：异步加载缓存中的资源，参数 callback 为加载完成后的回调函数。
- `addLoad()`：用于计数等待加载的资源数量。
- `removeLoad()`：用于计数已完成加载的资源数量。

2. JSON

- `getJson(name: string)`：根据资源名称返回已加载的 Json 资源。
- `setJson(asset: any[])`：将加载的 Json 资源保存在 `_json` 对象中。
- `loadJson(paths: string[])`：异步加载多个 Json 资源，并将加载的资源保存在`_json` 对象中。

3. Prefab

- `getPrefab(name: string)`：根据资源名称返回已加载的 Prefab 资源。
- `setPrefab(asset: any[])`：将加载的 Prefab 资源保存在 `_prefab` 对象中。
- `loadPrefab(paths: string[])`：异步加载多个 Prefab 资源，并将加载的资源保存在`_prefab` 对象中。

4. TXT

- `getTxt(name: string)`：根据资源名称返回已加载的 Text 资源。
- `setText(asset: any[])`：将加载的 Text 资源保存在 `_txt `对象中。
- `loadText(paths: string[])`：异步加载多个 Text 资源，并将加载的资源保存在`_txt` 对象中。

5. Sprite

- `getSprite(name: string)`：根据资源名称返回已加载的 Sprite 资源。
- `setSprite(asset: any[])`：将加载的 Sprite 资源保存在`_sprite` 对象中。

6. Sound

- `getSound(name: string)`：根据资源名称返回已加载的音频资源。
- `setSound(asset: any[])`：将加载的音频资源保存在`_sound` 对象中。

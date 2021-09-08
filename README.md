# Simple Scene React
提供一个 `Three for React` 的简单场景

## 1.安装
`npm install simple-scene-react`

`or`

`yarn add simple-scene-react`

## 2.使用
`import SimpleScene from 'simple-scene-react'`
``` 
<SimpleScene
  className="test-scene"
  showAxisHelper={false}
  resizeEnable={true}
  beforeRender={beforeRender}
  afterRender={afterRender}
  animate={animate}
  useDefaultLight={true}
  useDefaultCamera={false}
  onClick={onClick}
/> 
```
`SimpleScene`的宽度、高度由外层容器决定。

## 3.API
均非必填
| 属性    | 说明  | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- |
| className  | 容器类名 | string | - |
| showAxisHelper  | 是否显示坐标辅助 | boolean | false |
| resizeEnable  | 是否开启resize功能 | boolean | false |
| orbitControlsDisable  | 是否禁用OrbitControls，默认不禁用 | boolean | false |
| useDefaultLight  | 是否使用默认灯光，默认使用 | boolean | true |
| useDefaultCamera  | 是否使用默认摄像机，默认使用 | boolean | true |
| beforeRender  | render之前的回调函数，在此函数中可以添加控制灯光、摄像机、Mesh等 | Function | - |
| afterRender  | render之后的回调函数，在此函数中可以添加控制灯光、摄像机、Mesh、controls等 | Function | - |
| animate  | 动画执行过程中的回调 | Function | - |

## 4.回调函数参数
```
// beforeRender afterRender
interface RenderFunc {
  (
    target: SimpleScene,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ): any;
}
// animate
interface AnimateFunc {
  (
    target: SimpleScene,
    clock: THREE.Clock,
    scene: THREE.Scene,
    camera: THREE.Camera,
    controls: any
  ): any;
}
// onClick target为点击的第一个mesh
interface ClickFunc {
  (target: any, scene: THREE.Scene): any;
}

```

#### 使用
`import { clearScene } from 'simple-scene-react'`
`clearScene(scene)`
## 5.示例

## 6.备注
提供清空场景方法 `clearScene`, 用于手动清空内存。
`SimpleScene` 在 `componentWillUnmount` 阶段已进行了清理。
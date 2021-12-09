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
### 例1

建立场景 使用默认配置 显示辅助坐标轴
```
import React = require('react')
import SimpleScene from 'simple-scene-react'

const Scene3D = () => {
  return <SimpleScene className="container-3d" showAxisHelper={true} />
}

export default Scene3D

```

### 例2

官方示例，旋转的正方体
```
import React = require('react')
import SimpleScene from 'simple-scene-react'
import * as THREE from 'three'
import './style.css'

let cube: THREE.Mesh

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2)
  point.position.set(200, 200, 0)
  scene.add(point)
}

const addMesh = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
}

const Scene3D = () => {
  const beforeRender = async (target: any, scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) => {
    addLight(scene)
    addMesh(scene)
  }

  const animate = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }

  return <SimpleScene className="container-3d" showAxisHelper={true} beforeRender={beforeRender} animate={animate} />
}

export default Scene3D
```

更常见的应用见 `5.示例`

`SimpleScene`的宽度、高度由外层容器决定。

## 3.API
均非必填
| 属性    | 说明  | 类型 | 默认值 | 版本 |
|  ----  | ----  | ---- | ---- | ----- |
| className  | 容器类名 | string | - | - |
| style  | 样式 | any | - | - |
| showAxisHelper  | 是否显示坐标辅助 | boolean | false | - |
| resizeEnable  | 是否开启resize功能 | boolean | false | - |
| orbitControlsDisable  | 是否禁用OrbitControls，默认不禁用 | boolean | false | - |
| useDefaultLight  | 是否使用默认灯光，默认使用 | boolean | true | - |
| useDefaultCamera  | 是否使用默认摄像机，默认使用 | boolean | true | - |
| beforeRender  | render之前的回调函数，在此函数中可以添加控制灯光、摄像机、Mesh等 | Function | - | - |
| afterRender  | render之后的回调函数，在此函数中可以添加控制灯光、摄像机、Mesh、controls等 | Function | - | - |
| animate  | 动画执行过程中的回调 | Function | - | - |
| refresh  | refresh值变化会刷新整个场景，提供外部变化需要修改场景的情况（如轮询，重新获取数据等）。ps：会销毁之前的场景，见官方示例复刻版。 | boolean | - | 1.0.2 |
| addPass  | 动画执行过程中的回调 | Function | - | 1.0.5 |

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
## 5.示例
[初始化](https://silencetiger.github.io/simple-scene-react/#/step1)

[官方示例复刻](https://silencetiger.github.io/simple-scene-react/#/step2)

[太地月三体运动](https://silencetiger.github.io/simple-scene-react/#/stars)

[地图飞线](https://silencetiger.github.io/simple-scene-react/#/map)

[建筑大屏](https://silencetiger.github.io/simple-scene-react/#/building)

[天安门dae](https://silencetiger.github.io/simple-scene-react/#/tiananmen)

[纵向扫描](https://silencetiger.github.io/simple-scene-react/#/vertical-scan)

[横向扫描](https://silencetiger.github.io/simple-scene-react/#/horizontal-scan)

[cssRender + webglRedner](https://silencetiger.github.io/simple-scene-react/#/css-render)



源码可以见本仓库 `/example` 目录
## 6.备注
提供清空场景方法 `clearScene`, 用于手动清空内存。
#### 使用
`import { clearScene } from 'simple-scene-react'`

`clearScene(scene)`

`SimpleScene` 在 `componentWillUnmount` 阶段已进行了清理。
import React = require('react')
import SimpleScene from '../../../src/index';
import * as THREE from 'three'
import { Geometry, Face3 } from 'three/examples/jsm/deprecated/Geometry'
import * as d3 from 'd3-geo'
import FlyLine from 'fly-line'

// const chinaMap = require('./china.json')
import * as chinaMap from './china.json'

const cities = [
  [116.407718, 39.920912], // 北京
  [114.328824, 30.688323], // 武汉
  [87.615949, 43.857497], // 乌鲁木齐
  [91.14823, 29.761665], // 拉萨
  [121.448578, 31.235314], // 上海
  [114.328824, 22.844666], // 深圳
]

let projection: any //坐标转换对象
let lines: FlyLine[] = []

const addCamera = (target: SimpleScene, scene: THREE.Scene, width: number, height: number) => {
  target.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 1000)
  target.camera.position.set(0, -100, 100)
  scene.rotateZ(-Math.PI / 2)
}

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2)
  point.position.set(0, 0, 0)
  scene.add(point)
}

const lnglatToMector = (lnglat: any, center: any = [108.904496, 32.668849], scale: number = 1000) => {
  if (!projection) {
    projection = d3
      .geoMercator()
      .center(center) // 地图终点
      .scale(scale)
      .translate([0, 0])
  }
  const [y, x] = projection([...lnglat])
  return [x, y, 0]
}

const drawModel = (points: any, color: string, depth?: number) => {
  const shape = new THREE.Shape()

  points.forEach((d: any, i: number) => {
    const [x, y] = d
    if (i === 0) {
      shape.moveTo(x, y)
    } else if (i === points.length - 1) {
      shape.quadraticCurveTo(x, y, x, y)
    } else {
      shape.lineTo(x, y)
    }
  })

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth || -6,
    bevelEnabled: false,
  })
  const material = new THREE.MeshLambertMaterial({
    color: color,
    // map: texture,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })
  let geo = new Geometry().fromBufferGeometry(geometry)
  const mesh = new THREE.Mesh(geo.toBufferGeometry(), material)
  return mesh
}

const drawLine = (points: any, color: string) => {
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  })
  const geometry = new THREE.BufferGeometry()
  let vertices: any = []
  points.forEach((d: any) => {
    const [x, y, z] = d
    vertices.push(new THREE.Vector3(x, y, z + 0.1))
  })
  geometry.setFromPoints(vertices)
  const line = new THREE.Line(geometry, material)
  return line
}

const addMap = (scene: THREE.Scene) => {
  // 坐标转换
  chinaMap.features.forEach((d: any) => {
    d.vector3 = []
    d.geometry.coordinates.forEach((coordinates: any, i: number) => {
      d.vector3[i] = []
      coordinates.forEach((c: any, j: number) => {
        if (c[0] instanceof Array) {
          d.vector3[i][j] = []
          c.forEach((cinner: any) => {
            let cp = lnglatToMector(cinner)
            d.vector3[i][j].push(cp)
          })
        } else {
          let cp = lnglatToMector(c)
          d.vector3[i].push(cp)
        }
      })
    })
    return d
  })
  // 绘制地图模型
  const group = new THREE.Group()
  const lineGroup = new THREE.Group()
  chinaMap.features.forEach((d: any) => {
    const g: any = new THREE.Group() // 用于存放每个地图模块。||省份
    g.data = d
    d.vector3.forEach((points: any) => {
      if (points[0][0] instanceof Array) {
        points.forEach((p: any) => {
          const mesh = drawModel(p, 'blue', 10)
          const lineMesh = drawLine(p, '#FEE799')
          lineGroup.add(lineMesh)
          g.add(mesh)
        })
      }
    })
    group.add(g)
  })
  const lineGroupBottom = lineGroup.clone()
  lineGroupBottom.position.z = 10
  let wholeGroup = new THREE.Group()
  wholeGroup.add(lineGroup, lineGroupBottom, group)
  // wholeGroup.position.set(obj.position[0], obj.position[1], obj.position[2])
  scene.add(wholeGroup)
}

const addLine = (scene: THREE.Scene) => {
  for (let i = 0; i < 100; i++) {
    let random1 = parseInt(Math.random() * cities.length + '')
    let random2 = parseInt(Math.random() * cities.length + '')
    if (random1 !== random2) {
      let from = cities[random1]
      let to = cities[random2]
      let _from = lnglatToMector(from)
      let _to = lnglatToMector(to)
      let _line = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(_from[0], _from[1], 10),
        new THREE.Vector3((_from[0] + _to[0]) / 2, (_from[1] + _to[1]) / 2, 100 + Math.random() * 300),
        new THREE.Vector3(_to[0], _to[1], 10),
      )
      let points = _line.getPoints(1000)
      lines.push(
        new FlyLine(points, new THREE.Vector3(Math.random(), Math.random(), Math.random()), scene, 1, 0.1, 4, -1),
      )
    }
  }
}

const Map = () => {
  const beforeRender = async (target: any, scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) => {
    addCamera(target, scene, width, height)
    addLight(scene)
    addMap(scene)
    addLine(scene)
  }

  const animate = () => {
    lines.forEach(flyLine => {
      flyLine.animate()
    })
  }

  return (
    <SimpleScene
      style={{
        background: '#000000'
      }}
      showAxisHelper={false}
      beforeRender={beforeRender}
      animate={animate}
      useDefaultCamera={false}
    />
  )
}

export default Map

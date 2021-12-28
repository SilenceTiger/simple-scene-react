import React = require('react');
import SimpleScene from '../../../src/index';
import * as THREE from 'three';

let cube: THREE.Mesh;
const textureLoader = new THREE.TextureLoader();
const R = 400;
const PI = Math.PI;
const T = 10; // 运动时间 10秒
let CITA = 0; // 初始角度
let DIRECT = new THREE.Vector3(0, 0, 1)
/**
 * 生成圆形轨迹
 * @param r 半径
 * @param num 点的数量
 * @returns THREE.Vector3[]
 */
const generateTravel = (r: number, num: number): THREE.Vector3[] => {
  let arr: THREE.Vector3[] = [];
  for (let i = 0; i <= num; i++) {
    let cita = (2 * Math.PI * i) / num;
    let p = new THREE.Vector3(r * Math.cos(cita), r * Math.sin(cita), 0);
    p.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); // 绕X轴旋转90度
    arr.push(p);
  }
  return arr;
};

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2);
  point.position.set(500, 500, 200);
  scene.add(point);
};

const addMesh = async (scene: THREE.Scene) => {
  const cubeGeo = new THREE.BoxGeometry(80, 80, 80);
  let texture = await textureLoader.load(require('./texture/house_1.png'));
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    wireframe: false,
  });
  cube = new THREE.Mesh(cubeGeo, material);
  // cube.position.set(0, 50, -50);
  scene.add(cube);

  // 轨迹
  let points = generateTravel(R, 200);
  let curveGeo = new THREE.BufferGeometry();
  curveGeo.setFromPoints(points);
  let lineMaterial = new THREE.LineBasicMaterial({
    color: '#0000ff',
  });
  let curve = new THREE.Line(curveGeo, lineMaterial);
  scene.add(curve);
};

const Scene3D = () => {
  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    addLight(scene);
    addMesh(scene);
  };

  const animate = () => {
    let dt = 1 / 60;
    CITA += ((2 * PI) / T) * dt;
    let currentPosition = new THREE.Vector3(
      R * Math.cos(CITA),
      0,
      R * Math.sin(CITA)
    ); // 当前位置
    cube.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
    // let preCita = CITA - ((2 * PI) / T) * dt; // 上一个位置角度
    // let prePosition = new THREE.Vector3(
    //   R * Math.cos(preCita),
    //   0,
    //   R * Math.sin(preCita)
    // ); // 上一个位置
    let nextCita = CITA + ((2 * PI) / T) * dt; // 下一个位置角度
    let nextPosition = new THREE.Vector3(
      R * Math.cos(nextCita),
      0,
      R * Math.sin(nextCita)
    ); // 下一个位置
    // let currentDirection = currentPosition.clone().sub(prePosition).normalize(); // 当前方向
    let nextDirection = nextPosition.clone().sub(currentPosition).normalize(); // 下一个方向
    let angle = nextDirection.clone().angleTo(DIRECT); // 下一个方向与当前方向的夹角
    // let currentAngle = currentDirection.angleTo(nextDirection); // 当前角度
    // 修改位置
    // 修改方向
    let origin = nextDirection.x * DIRECT.z - nextDirection.z * DIRECT.x
    DIRECT = nextDirection.clone()
    if(origin > 0) {
      angle = -angle;
    }
    if (cube.rotation.y >= 2 * PI || cube.rotation.y <= -2 * PI) {
      cube.rotation.y = 0;
    }
    cube.rotation.y -= angle;
  };

  return (
    <SimpleScene
      style={{
        background: '#000',
      }}
      showAxisHelper={true}
      beforeRender={beforeRender}
      animate={animate}
    />
  );
};

export default Scene3D;

import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SimpleScene from '../../../src/index';

const GLBLoader = new GLTFLoader();

const buildings = [
  {
    name: '购物中心',
    modal: require('./glb/Early Skyscraper.glb'),
    position: new THREE.Vector3(0, 0, 0),
    scale: 8,
  },
  {
    name: '工厂',
    modal: require('./glb/Factory Complex.glb'),
    position: new THREE.Vector3(-300, 0, 300),
    scale: 20,
  },
  {
    name: '学校',
    modal: require('./glb/Multi-story School.glb'),
    position: new THREE.Vector3(300, 0, 400),
    scale: 20,
  },
  {
    name: '办公室',
    modal: require('./glb/Office Building.glb'),
    position: new THREE.Vector3(300, 0, 100),
    scale: 20,
  },
];

let mixer: any;

const addBuildings = (target: any, scene: THREE.Scene) => {
  let intersectArr: any = [];
  buildings.forEach(b => {
    GLBLoader.load(b.modal, gltf => {
      let modal = gltf.scene;
      modal.scale.set(b.scale, b.scale, b.scale);
      modal.rotation.y = Math.PI / 2;
      modal.position.set(b.position.x, b.position.y, b.position.z);
      scene.add(modal);
      let obj = modal.children[0].children[0]
      obj.name = b.name
      intersectArr.push(obj);
    });
  });
  target.setIntersectArray(intersectArr)
};

const addCamera = (
  target: SimpleScene,
  scene: THREE.Scene,
  width: number,
  height: number
) => {
  target.camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  target.camera.position.set(0, 200, 1000);
  target.camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
};

const addLight = (scene: THREE.Scene) => {
  // 默认存在环境光  new THREE.AmbientLight(0xffffff, 0.8);
  // 若不想使用可以 useDefaultLight = false
  // 点光源
  let point = new THREE.PointLight(0xedf069, 2);
  point.position.set(0, -400, 1000);
  scene.add(point);
};

const ThreeStar = () => {
  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    // addRampaging(scene);
    addBuildings(target, scene);
    // if useDefaultCamera = false 则需自己定义摄像头
    addCamera(target, scene, width, height);
    // 补充light
    addLight(scene);
  };

  const animate = (target: any, clock: THREE.Clock) => {
    let delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }
  };

  const onClick = (target: any, scene: THREE.Scene) => {
    console.log(target.object.name);
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <SimpleScene
        style={{
          background: '#000000',
        }}
        showAxisHelper={true}
        resizeEnable={true}
        beforeRender={beforeRender}
        animate={animate}
        useDefaultLight={true}
        useDefaultCamera={false}
        onClick={onClick}
      />
    </div>
  );
};

export default ThreeStar;

import * as React from 'react';
import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import SimpleScene from '../../../src/index';

const loader = new ColladaLoader();

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
  let point = new THREE.PointLight(0xffffff, 0.4);
  point.position.set(400, 400, 400);
  scene.add(point);
};

const addBuildings = (scene: THREE.Scene) => {
  loader.load('Tiananmen.dae', res => {
    let scale = 0.2
    let modal = res.scene;
    modal.scale.set(scale, scale, scale);
    modal.position.set(250,0,0)
    scene.add(modal);
  });
};

const Buildings = () => {
  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    // addLabels(scene);
    addBuildings(scene);
    // if useDefaultCamera = false 则需自己定义摄像头
    addCamera(target, scene, width, height);
    // 补充light
    addLight(scene);
  };

  const animate = (target: any, clock: THREE.Clock) => {
    let delta = clock.getDelta();
  };


  return (
    <SimpleScene
      style={{
        background: '#000',
      }}
      showAxisHelper={true}
      resizeEnable={true}
      beforeRender={beforeRender}
      animate={animate}
      useDefaultLight={true}
      useDefaultCamera={false}
    />
  );
};

export default Buildings;

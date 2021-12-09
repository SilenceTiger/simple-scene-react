import React = require('react');
import SimpleScene from '../../../src/index';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ScanShader3 as ScanShader } from './shader';

let cube: THREE.Mesh;
const textureLoader = new THREE.TextureLoader();
const ratio = 1.8;
const xMin = -ratio * 360;
const xMax = ratio * 360;
const zMin = -360;
const zMax = 360;
let layout = [
  {
    r: 360,
    n: 40,
  },
  {
    r: 300,
    n: 30,
  },
  {
    r: 240,
    n: 24,
  },
  {
    r: 180,
    n: 18,
  },
  {
    r: 120,
    n: 12,
  },
  {
    r: 60,
    n: 6,
  },
  {
    r: 0,
    n: 1,
  },
];

const generateBuildingData = () => {
  let data: any = [];
  for (let i = 0; i < layout.length; i++) {
    let r = layout[i].r;
    let n = layout[i].n;
    for (let j = 0; j < n; j++) {
      let cita = ((2 * Math.PI) / n) * j;
      let x = ratio * r * Math.cos(cita);
      let z = r * Math.sin(cita);
      let w = Math.random() * 30 + 20; // 宽度 [30-50]
      let h = Math.random() * 150 + 100; // 高度 [70-100]
      data.push({
        x: x,
        y: h / 2,
        z: z,
        height: h,
        width: w,
      });
    }
  }
  return data;
};

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0x00ff00, 0.3);
  point.position.set(800, 800, 0);
  scene.add(point);
};

const addCamera = (
  target: SimpleScene,
  scene: THREE.Scene,
  width: number,
  height: number
) => {
  target.camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    2000
  );
  target.camera.position.set(0, 200, 1000);
  target.camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
};

const addMesh = async (scene: THREE.Scene) => {
  let group = new THREE.Group();
  let data = generateBuildingData();
  for (let i = 0; i < data.length; i++) {
    let buildingItem = data[i];
    const cubeGeo = new THREE.BoxGeometry(
      buildingItem.width,
      buildingItem.height,
      buildingItem.width
    );
    const material = new THREE.ShaderMaterial({
      uniforms: ScanShader.uniforms,
      vertexShader: ScanShader.vertexShader,
      fragmentShader: ScanShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      lights: true,
      wireframe: false,
    });
    cube = new THREE.Mesh(cubeGeo, material);
    cube.position.set(buildingItem.x, buildingItem.y, buildingItem.z);
    group.add(cube);
  }
  group.position.set(0, 0, 0);
  scene.add(group);
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
    addCamera(target, scene, width, height);
    await addMesh(scene);
  };

  const addPass = (
    composer: EffectComposer,
    renderer: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    let fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.y =
      1 / (height * pixelRatio);
    composer.addPass(fxaaPass);
    // bloompass
    let bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.1,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = 0;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0;
    composer.addPass(bloomPass);
  };

  const animate = () => {
    if (ScanShader.uniforms.scanX) {
      ScanShader.uniforms.scanX.value =
        ScanShader.uniforms.scanX.value > xMax
          ? xMin
          : ScanShader.uniforms.scanX.value + 3;
    }
  };

  return (
    <SimpleScene
      style={{
        background: '#000',
      }}
      showAxisHelper={false}
      useDefaultCamera={false}
      beforeRender={beforeRender}
      animate={animate}
      addPass={addPass}
    />
  );
};

export default Scene3D;

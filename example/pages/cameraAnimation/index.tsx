import React = require('react');
import SimpleScene from '../../../src/index';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ScanShader3 as ScanShader } from './shader';
import anime from 'animejs/lib/anime.es.js';

let cube: THREE.Mesh;
// const ImageLoader = new THREE.ImageLoader();
const textureLoader = new THREE.TextureLoader();

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xffffff, 2);
  point.position.set(200, 200, 0);
  scene.add(point);
};

const addMesh = async (scene: THREE.Scene) => {
  const _h = 200;
  const cubeGeo = new THREE.BoxGeometry(100, _h, 100);
  let texture_bottom = await textureLoader.load(
    require('./texture/house_2.png')
  );
  const material = new THREE.ShaderMaterial({
    uniforms: ScanShader.uniforms,
    vertexShader: ScanShader.vertexShader,
    fragmentShader: ScanShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const material_bottom = new THREE.MeshPhongMaterial({
    map: texture_bottom,
    // side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  cube = new THREE.Mesh(cubeGeo, [
    material,
    material,
    material_bottom,
    material_bottom,
    material,
    material,
  ]);
  cube.position.set(0, _h / 2, 0);
  scene.add(cube);
};

const animateCamera = (
  scene: THREE.Scene,
  camera: THREE.Camera,
  controls: any
) => {
  const curPosition = camera.position;
  anime({
    targets: curPosition,
    keyframes:[
      {
        x: 300,
        y: 300,
        z: -300
      },
      {
        x: -300,
        y: 300,
        z: -300
      },
      {
        x: -300,
        y: 300,
        z: 300
      },
      {
        x: 300,
        y: 300,
        z: 300
      },
    ],
    loop: true,
    duration: 12000,
    easing: 'linear',
    begin: (ani) => {
      controls.enabled = false
      console.log("begin")
    },
    update: (ani) => {
      controls.enabled = false
      // controls.target.set(curPosition.x, curPosition.y, curPosition.z)
      controls.update()
    },
    complete: (ani) => {
      controls.enabled = true
      console.log("end")
      console.log(curPosition)
    }
  });
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
    await addMesh(scene);
  };

  const afterRender = (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) => {
    animateCamera(scene, camera, target.controls);
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
      1.5,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = 0;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0;
    composer.addPass(bloomPass);

    // ??????????????????
    let outLinePass = new OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      camera
    );
    outLinePass.edgeStrength = 1; //???
    outLinePass.edgeGlow = 5; //??????
    outLinePass.edgeThickness = 2; //?????????
    outLinePass.pulsePeriod = 2; //??????
    outLinePass.usePatternTexture = false; //true
    outLinePass.visibleEdgeColor.set('red'); // ?????????????????????
    outLinePass.hiddenEdgeColor.set('#00ffff');
    composer.addPass(outLinePass);
  };

  const animate = () => {
    if (ScanShader.uniforms.lightHeight) {
      ScanShader.uniforms.lightHeight.value =
        ScanShader.uniforms.lightHeight.value > 100
          ? -100
          : ScanShader.uniforms.lightHeight.value + 2;
    }
  };

  return (
    <SimpleScene
      style={{
        background: '#000',
      }}
      showAxisHelper={true}
      beforeRender={beforeRender}
      afterRender={afterRender}
      animate={animate}
      addPass={addPass}
    />
  );
};

export default Scene3D;

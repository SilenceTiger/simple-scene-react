import React = require('react');
import SimpleScene from '../../../src/index';
import * as THREE from 'three';
import {
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ScanShader3 as ScanShader } from './shader';

let cssRender = new CSS3DRenderer();
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
  // const material = new THREE.MeshPhongMaterial({
  //   map: texture,
  //   transparent: true,
  //   opacity: 0.8,
  // });
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

const initCssRender = (
  container: any,
  width: number,
  height: number,
  scene: THREE.Scene
) => {
  cssRender.setSize(width, height);
  cssRender.domElement.style.position = 'absolute';
  cssRender.domElement.style.zIndex = '1';
  cssRender.domElement.style.pointerEvents = 'none';
  container.appendChild(cssRender.domElement);
  const CssContainer = document.createElement('div');
  const CssContainerObject = new CSS3DObject(CssContainer);
  scene.add(CssContainerObject);
  const card = document.createElement('div');
  card.style.width = '200px';
  card.style.height = '50px';
  card.style.backgroundColor = '#fff';
  card.style.color = '#0000ff';
  card.innerText = 'hello world';
  const cardObject = new CSS3DObject(card);
  cardObject.position.set(-500, 0, 0);
  CssContainerObject.add(cardObject);
};

const Scene3D = () => {
  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    // init css render
    console.log(target.renderer.domElement);
    target.renderer.domElement.style.position = "absolute";
    target.renderer.domElement.style.top = "0px";
    target.renderer.domElement.style.left = "0px";
    initCssRender(target.container, width, height, scene);
    addLight(scene);
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
      1.5,
      0.4,
      0.85
    );
    bloomPass.renderToScreen = true;
    bloomPass.threshold = 0;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0;
    composer.addPass(bloomPass);

    // 边缘发光效果
    let outLinePass = new OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      camera
    );
    outLinePass.edgeStrength = 1; //粗
    outLinePass.edgeGlow = 5; //发光
    outLinePass.edgeThickness = 2; //光晕粗
    outLinePass.pulsePeriod = 2; //闪烁
    outLinePass.usePatternTexture = false; //true
    outLinePass.visibleEdgeColor.set('red'); // 轮廓边缘的颜色
    outLinePass.hiddenEdgeColor.set('#00ffff');
    composer.addPass(outLinePass);
  };

  const animate = (target: any, clock: any, scene: any, camera: any) => {
    cssRender.render(scene, camera);

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
      animate={animate}
      addPass={addPass}
    />
  );
};

export default Scene3D;

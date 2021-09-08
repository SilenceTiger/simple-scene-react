import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as THREE from 'three';
import SimpleScene from '../src/index';
import Star from './Star';
import './index.css';

const stars = [
  new Star('Sun', require('./texture/sun.jpg'), 100, [0, 0, 0], 0),
  new Star(
    'Earth',
    require('./texture/earth.jpg'),
    50,
    [650, 0, 0],
    0,
    30,
    650
  ),
  new Star('Moon', require('./texture/moon.jpg'), 30, [800, 0, 0], 0, 5, 150),
];

const ImageLoader = new THREE.ImageLoader();

const App = () => {
  const addStars = async (scene: THREE.Scene) => {
    for (let i = 0; i < stars.length; i++) {
      let star = stars[i];
      let sphereGeo = new THREE.SphereGeometry(star.raduis, 50, 50); //创建一个球体几何对象
      let img = await ImageLoader.load(star.image);
      let texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      let materialBasic = new THREE.MeshPhongMaterial({
        map: texture,
        // wireframe: true,
        side: THREE.DoubleSide,
      });
      let sphereMesh = new THREE.Mesh(sphereGeo, materialBasic);
      sphereMesh.position.set(
        star.position[0],
        star.position[1],
        star.position[2]
      ); //几何体中心位置
      sphereMesh.name = star.name;
      star.mesh = sphereMesh;
      scene.add(sphereMesh);
    }
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

  const addLight = (scene: THREE.Scene) => {
    // 默认存在环境光  new THREE.AmbientLight(0xffffff, 0.8);
    // 若不想使用可以 useDefaultLight = false
    // 点光源 
    let point = new THREE.PointLight(0xEDF069, 2);
    point.position.set(0, 0, 0); 
    scene.add(point);
    // 平行光
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight.position.set(600, 600, 600)
    scene.add(directionalLight)
  };

  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    addStars(scene);
    // if useDefaultCamera = false 则需自己定义摄像头
    addCamera(target, scene, width, height);
    // 补充light
    addLight(scene);
  };

  const afterRender = (
    target: SimpleScene,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width?: number,
    height?: number
  ) => {
    // controls.autoRotate = true
  };

  const animate = (
    target: SimpleScene,
    clock: THREE.Clock,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) => {
    let delta = clock.getDelta();
    // 自转
    stars.forEach(star => {
      if (star.mesh) {
        star.mesh.rotation.y += delta;
      }
    });
    // 公转
    // 地球绕太阳转
    let earth = stars[1];
    if (earth.mesh) {
      earth.cita += (delta * 2 * Math.PI) / earth.T;
      earth.mesh.position.set(
        earth.R * Math.cos(earth.cita),
        0,
        earth.R * Math.sin(earth.cita)
      );
    }
    // 月球绕地球转
    let moon = stars[2];
    if (moon.mesh) {
      moon.cita += (delta * 2 * Math.PI) / moon.T;
      moon.mesh.position.set(
        moon.R * Math.cos(moon.cita) + earth.R * Math.cos(earth.cita),
        0,
        moon.R * Math.sin(moon.cita) + earth.R * Math.sin(earth.cita)
      );
    }
  };

  const onClick = (target: any, scene: THREE.Scene) => {
    alert(target?.object.name)
  }

  return (
    <div className="container">
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

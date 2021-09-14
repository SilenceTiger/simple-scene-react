import React = require('react');
import SimpleScene from '../../../src/index';
import * as THREE from 'three';

let cube: THREE.Mesh;
let sphere: THREE.Mesh;

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2);
  point.position.set(200, 200, 0);
  scene.add(point);
};

const addMesh = (scene: THREE.Scene, data: number) => {
  console.log(data);
  const cubeGeo = new THREE.BoxGeometry(100, 100, 100);
  const spGeo = new THREE.SphereGeometry(50, 50, 50);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(cubeGeo, material);
  cube.position.set(0, 50, -50);
  sphere = new THREE.Mesh(spGeo, material);
  sphere.position.set(50, -50, 50);
  scene.add(cube);
  scene.add(sphere);
};

const Scene3D = () => {
  const [data, setData] = React.useState(1);
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    let timer = setInterval(() => {
      setData(d => d + 1);
      setRefresh(r => !r)
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);


  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    addLight(scene);
    addMesh(scene, data);
  };

  const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return (
    <SimpleScene
      style={{
        background: '#000',
      }}
      showAxisHelper={true}
      beforeRender={beforeRender}
      animate={animate}
      refresh={refresh}
    />
  );
};

export default Scene3D;

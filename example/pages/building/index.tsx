import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SimpleScene from '../../../src/index';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const GLBLoader = new GLTFLoader();

const data = [
  {
    key: 'A',
    value: [
      { time: '1999-03-05 23:36:31', count: 28 },
      { time: '1999-03-05 23:36:31', count: 95 },
      { time: '1999-03-05 23:36:31', count: 21 },
      { time: '1999-03-05 23:36:31', count: 86 },
      { time: '1999-03-05 23:36:31', count: 63 },
      { time: '1999-03-05 23:36:31', count: 37 },
      { time: '1999-03-05 23:36:31', count: 60 },
      { time: '1999-03-05 23:36:31', count: 75 },
      { time: '1999-03-05 23:36:31', count: 25 },
      { time: '1999-03-05 23:36:31', count: 99 },
    ],
  },
  {
    key: 'B',
    value: [
      { time: '2001-07-30 16:20:27', count: 7 },
      { time: '2001-07-30 16:20:27', count: 79 },
      { time: '2001-07-30 16:20:27', count: 13 },
      { time: '2001-07-30 16:20:27', count: 84 },
      { time: '2001-07-30 16:20:27', count: 22 },
      { time: '2001-07-30 16:20:27', count: 81 },
      { time: '2001-07-30 16:20:27', count: 87 },
      { time: '2001-07-30 16:20:27', count: 3 },
      { time: '2001-07-30 16:20:27', count: 35 },
      { time: '2001-07-30 16:20:27', count: 30 },
    ],
  },
  {
    key: 'C',
    value: [
      { time: '1989-03-17 19:05:21', count: 62 },
      { time: '1989-03-17 19:05:21', count: 76 },
      { time: '1989-03-17 19:05:21', count: 7 },
      { time: '1989-03-17 19:05:21', count: 8 },
      { time: '1989-03-17 19:05:21', count: 57 },
      { time: '1989-03-17 19:05:21', count: 26 },
      { time: '1989-03-17 19:05:21', count: 53 },
      { time: '1989-03-17 19:05:21', count: 88 },
      { time: '1989-03-17 19:05:21', count: 43 },
      { time: '1989-03-17 19:05:21', count: 78 },
    ],
  },
];

const buildings = [
  {
    name: '购物中心',
    modal: require('./glb/Early Skyscraper.glb'),
    position: new THREE.Vector3(0, 0, 0),
    scale: 8,
    rotationY: Math.PI / 2,
  },
  {
    name: '工厂',
    modal: require('./glb/Factory Complex.glb'),
    position: new THREE.Vector3(-300, 0, 300),
    scale: 20,
    rotationY: Math.PI / 2,
  },
  {
    name: '学校',
    modal: require('./glb/Multi-story School.glb'),
    position: new THREE.Vector3(300, 0, 400),
    scale: 20,
    rotationY: (3 * Math.PI) / 2,
  },
  {
    name: '办公室',
    modal: require('./glb/Office Building.glb'),
    position: new THREE.Vector3(300, 0, 100),
    scale: 30,
    rotationY: Math.PI / 2,
  },
];

const labels = [
  {
    name: '商务大楼',
    position: new THREE.Vector3(180, 300, 0),
    buildTime: 2000,
    count: 345,
  },
  {
    name: '工厂',
    position: new THREE.Vector3(-300, 100, 200),
    buildTime: 2010,
    count: 1445,
  },
  {
    name: '办事大厅',
    position: new THREE.Vector3(300, 100, 150),
    buildTime: 2010,
    count: 145,
  },
  {
    name: '学校',
    position: new THREE.Vector3(300, 140, 400),
    buildTime: 1982,
    count: 231,
  },
];

let mixer: any;

const addBuildings = (target: any, scene: THREE.Scene) => {
  let intersectArr: any = [];
  buildings.forEach(b => {
    GLBLoader.load(b.modal, gltf => {
      let modal = gltf.scene;
      modal.scale.set(b.scale, b.scale, b.scale);
      modal.rotation.y = b.rotationY;
      modal.position.set(b.position.x, b.position.y, b.position.z);
      scene.add(modal);
      let obj = modal.children[0].children[0];
      obj.name = b.name;
      intersectArr.push(obj);
    });
  });
  target.setIntersectArray(intersectArr);
};

const createCanvas = (w: number, h: number, color: string, text1: string, text2: string,text3: string) => {
  let canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  let c: any = canvas.getContext('2d');
  c.fillStyle = 'transparent'

  c.fillRect(0, 0, w, h);
  c.beginPath();
  let _w = w / 2;
  let _h = h / 2;
  c.translate(0, 20);
  c.fillStyle = color; //文本填充颜色
  c.font = `14px Arial`; //字体样式设置
  c.textBaseline = 'middle'; //文本与fillText定义的纵坐标
  // c.textAlign = 'center'; //文本居中(以fillText定义的横坐标)
  c.fillText(text1, 0, 0);
  c.translate(0, 20);
  c.fillText(text2, 0, 0);
  c.translate(0, 20);
  c.fillText(text3, 0, 0);
  return canvas;
};

const addLabels = (scene: THREE.Scene) => {
  labels.forEach(l => {
    // let canvas = createCanvas(100, 100, 'red', `${l.name}\n建造时间：${l.buildTime}\n实时人数${l.count}`);
    let canvas = createCanvas(120, 100, '#40AEF6', l.name, `建造时间：${l.buildTime}`, `实时人数：${l.count}`);

    let texture = new THREE.CanvasTexture(canvas);
    let spriteMaterial = new THREE.SpriteMaterial({
      // color: 0xffffff, //设置精灵矩形区域颜色
      // rotation: i === 0 ? Math.PI / 6 : 2 * Math.PI, //旋转精灵对象45度，弧度值
      map: texture, //设置精灵纹理贴图
    });

    let mesh = new THREE.Sprite(spriteMaterial);
    mesh.position.set(l.position.x, l.position.y, l.position.z); //几何体中心位置
    mesh.scale.set(100, 100, 1);

    scene.add(mesh);
  });
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

const Buildings = () => {
  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    addLabels(scene);
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
    console.log(target?.object?.name);
  };

  const option1: any = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(21, 84, 155, 0.6)',
      axisPointer: {
        type: 'shadow',
      },
      position: function(pos: any) {
        return pos;
      },
    },
    grid: {
      top: 20,
      left: 30,
      right: 30,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      splitLine: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#C4C7CC',
          margin: 15,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#333333',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      axisTick: { show: false },
      axisLabel: {
        textStyle: {
          color: '#C4C7CC',
          margin: 15,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#333333',
        },
      },
      inverse: true,
    },
    series: [
      {
        type: 'bar',
        data: [100, 83, 78, 73, 65, 56, 50, 44, 31, 22],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#0B7D83' },
            { offset: 1, color: '#36AEFD' },
          ]),
        },
        barWidth: 10,
        label: {
          show: true,
          position: 'insideTopRight',
          valueAnimation: true,
          color: '#1F9DFF',
          offset: [5, -18],
        },
      },
    ],
    legend: {
      show: false,
    },
  };

  const option2: any = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(21, 84, 155, 0.6)',
      axisPointer: {
        type: 'shadow',
      },
      position: function(pos: any) {
        return pos;
      },
    },
    grid: {
      top: 40,
      left: 30,
      right: 30,
      bottom: 10,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0] && data[0].value?.map((item: any) => item.time),
      splitLine: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#2A71B3',
          margin: 15,
          fontSize: 10,
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#333333',
        },
      },
      axisTick: { show: false },
    },
    yAxis: {
      axisTick: { show: false },
      axisLabel: {
        textStyle: {
          color: '#2A71B3',
          margin: 15,
          fontSize: 10,
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#333333',
        },
      },
      splitLine: {
        show: false,
      },
    },
    series: data.map((item: any) => {
      return {
        name: item.key,
        type: 'line',
        symbol: 'none',
        data: item.value.map((t: any) => t.count),
        // lineStyle: {
        //   color: item.color,
        // },
        areaStyle: {
          color: 'rgba(17,30,53,0.8)',
        },
      };
    }),
    color: ['#FF0000', '#FFD22F', '#328DDE'],
    legend: {
      data: data.map((item: any) => {
        return {
          name: item.key,
          itemStyle: {
            color: item.color,
          },
        };
      }),
      right: 8,
      top: 8,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#fff',
        fontSize: 10,
      },
    },
  };

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: 350,
          width: 400,
        }}
      >
        <ReactEcharts
          option={option1}
          notMerge={true}
          style={{ height: '100%' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          height: 300,
          width: 500,
          right: 0,
        }}
      >
        <ReactEcharts
          option={option2}
          notMerge={true}
          style={{ height: '100%' }}
        />
      </div>
      <SimpleScene
        style={{
          background: '#000',
        }}
        showAxisHelper={false}
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

export default Buildings;

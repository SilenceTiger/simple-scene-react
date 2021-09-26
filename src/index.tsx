import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { delay, clearScene } from './utils';
export { delay, clearScene };

interface RenderFunc {
  (
    target: SimpleScene,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ): any;
}

interface AnimateFunc {
  (
    target: SimpleScene,
    clock: THREE.Clock,
    scene: THREE.Scene,
    camera: THREE.Camera,
    controls: any
  ): any;
}

interface ClickFunc {
  (target: any, scene: THREE.Scene): any;
}

interface Props {
  showAxisHelper?: boolean;
  className?: string;
  resizeEnable?: boolean;
  orbitControlsDisable?: boolean;
  beforeRender?: RenderFunc;
  afterRender?: RenderFunc;
  animate?: AnimateFunc;
  useDefaultLight?: boolean;
  useDefaultCamera?: boolean;
  onClick?: ClickFunc;
  style?: any
  refresh?: boolean
}

const resolveBool = (b: boolean | undefined) => (b === undefined ? true : b);

interface State {}

class SimpleScene extends React.Component<Props, State> {
  private domRef = React.createRef<HTMLDivElement>();
  private animateFrame: any;
  private raycaster: any = new THREE.Raycaster();
  public scene: THREE.Scene;
  public camera: any = undefined;
  public renderer: THREE.Renderer;
  public container: any;
  public controls: any;
  public clock: THREE.Clock = new THREE.Clock();
  public intersectArray: any
  constructor(props: any) {
    super(props);
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
  }

  componentDidMount() {
    this.init();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if(nextProps.refresh !== this.props.refresh) {
      this.init()
    }
  }

  async init() {
    clearScene(this.scene);
    await delay(10);
    this.container = this.domRef.current;
    let width = this.container.clientWidth;
    let height = this.container.clientHeight;
    this.animateFrame && cancelAnimationFrame(this.animateFrame);
    this.props.showAxisHelper && this.addAxisHelper();
    resolveBool(this.props.useDefaultLight) && this.addLight();
    resolveBool(this.props.useDefaultCamera) && this.addCamera(width, height);
    await this.renderData(width, height);
    this.startRender(width, height);
    this.addEvent();
  }

  addAxisHelper() {
    //辅助坐标系
    const axisHelper = new THREE.AxesHelper(300);
    this.scene.add(axisHelper);
  }

  addLight() {
    //环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
  }

  addCamera(width: number, height: number) {
    // let k = width / height; //窗口宽高比
    // let s = 290; //三维场景显示范围控制系数，系数越大，显示的范围越大
    // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 2000);
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000
    );
    this.camera.position.set(300, 300, 300); //设置相机位置
  }

  async renderData(width: number, height: number) {
    this.props.beforeRender &&
      (await this.props.beforeRender(
        this,
        this.scene,
        this.camera,
        width,
        height
      ));
  }

  startRender(width: number, height: number) {
    this.renderer.setSize(width, height); //设置渲染区域尺寸
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
    this.renderGL();
    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.props.afterRender &&
      this.props.afterRender(this, this.scene, this.camera, width, height);
    if (this.props.orbitControlsDisable) {
      this.controls.enabled = false;
    }
  }

  addEvent() {
    window.addEventListener('click', this.onClickFn);
    window.addEventListener('resize', this.onWindowResize);
  }

  setIntersectArray(arr: any) {
    this.intersectArray = arr
  }

  componentWillUnmount() {
    clearScene(this.scene);
    window.removeEventListener('click', this.onClickFn);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onClickFn = (e: any) => {
    if (this.props.onClick) {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      let rectObj = this.container.getBoundingClientRect();
      let Sx = e.clientX - rectObj.left;
      let Sy = e.clientY - rectObj.top;
      let x = (Sx / width) * 2 - 1;
      let y = -(Sy / height) * 2 + 1;
      this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
      let intersects: any = this.raycaster.intersectObjects(
        this.intersectArray || this.scene.children,
        false
      );
      if (intersects[0]) {
        this.props.onClick(intersects[0], this.scene);
      }
      else {
        this.props.onClick(null, this.scene)
      }
    }
  };

  onWindowResize = () => {
    if (this.props.resizeEnable) {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  };

  renderGL() {
    this.renderer.render(this.scene, this.camera);
    this.props.animate &&
      this.props.animate(
        this,
        this.clock,
        this.scene,
        this.camera,
        this.controls
      );
    this.animateFrame = requestAnimationFrame(this.renderGL.bind(this));
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={this.domRef}
        style={{
          width: '100%',
          height: '100%',
          ...this.props.style
        }}
      ></div>
    );
  }
}

export default SimpleScene;

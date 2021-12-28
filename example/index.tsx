import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Step1 from './pages/step1';
import Step2 from './pages/step2';
import ThreeStar from './pages/stars';
import Map from './pages/map';
import Building from './pages/building';
import Tiananmen from './pages/tiananmen';
import VerticalScan from './pages/verticalScan';
import HorizontalScan from './pages/horizontalScan';
import CssRender from './pages/cssRender';
import Travel from './pages/travel';
import './index.css';

const MENU_DATA = [
  {
    title: '初始化',
    path: '/step1',
    component: Step1,
  },
  {
    title: '官方示例复刻',
    path: '/step2',
    component: Step2,
  },
  {
    title: '太地月三体运动',
    path: '/stars',
    component: ThreeStar,
  },
  {
    title: 'Map飞线',
    path: '/map',
    component: Map,
  },
  {
    title: '建筑大屏demo',
    path: '/building',
    component: Building,
  },
  {
    title: '天安门',
    path: '/tiananmen',
    component: Tiananmen,
  },
  {
    title: '纵向扫描+composer',
    path: '/vertical-scan',
    component: VerticalScan,
  },
  {
    title: '横向扫描+叠加点光',
    path: '/horizontal-scan',
    component: HorizontalScan,
  },
  {
    title: 'CssRender + WebglRender + Anime',
    path: '/css-render',
    component: CssRender,
  },
  {
    title: 'Travel',
    path: '/travel',
    component: Travel,
  },
];

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="title">Menu</div>
      {MENU_DATA.map(item => (
        <Link to={item.path} key={item.path} target="_blank">
          {item.title}
        </Link>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="container">
      <HashRouter basename="/">
        <Switch>
          {MENU_DATA.map(item => (<Route path={item.path} key={item.path} component={item.component} />))}
          <Route path="/menu" component={Menu} />
          <Route path="/" render={() => <Redirect to="/menu" />} />
        </Switch>
      </HashRouter>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

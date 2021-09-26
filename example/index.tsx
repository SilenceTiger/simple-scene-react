import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Step1 from './pages/step1';
import Step2 from './pages/step2';
import ThreeStar from './pages/stars';
import Map from './pages/map'
import Building from './pages/building'
import './index.css';

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="title">Menu</div>
      <Link to="/step1" target="_blank">
        1.初始化
      </Link>
      <Link to="/step2" target="_blank">
        2.官方示例复刻
      </Link>
      <Link to="/stars" target="_blank">
        3.太地月三体运动
      </Link>
      <Link to="/map" target="_blank">
        4.Map飞线
      </Link>
      <Link to="/building" target="_blank">
        5.Building
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <div className="container">
      <HashRouter basename="/">
        <Switch>
          <Route path="/menu" component={Menu} />
          <Route path="/step1" component={Step1} />
          <Route path="/step2" component={Step2} />
          <Route path="/stars" component={ThreeStar} />
          <Route path="/map" component={Map} />
          <Route path="/building" component={Building} />
          <Route path="/" render={() => <Redirect to="/menu" />} />
        </Switch>
      </HashRouter>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

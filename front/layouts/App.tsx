import loadable from '@loadable/component'; // React에서 코드스플릿팅 해줌
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn')); // loadable로 페이지 불러오기
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;

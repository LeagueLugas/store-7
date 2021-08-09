import React from 'react';
import MainPage from '@/Pages/Main';
import { ETLink, ETRouter, ETRoute } from './Router';

const App = () => {
  return (
    <div>
      <ETRouter>
        <ETRoute path='/' exact component={MainPage}></ETRoute>
        <ETRoute path='/login' exact component={Login}></ETRoute>
        <ETRoute path='/about' exact component={About}></ETRoute>
      </ETRouter>
      <Navigator />
    </div>
  );
};

function Navigator() {
  return (
    <>
      <ETLink to='/'>home</ETLink>
      <ETLink to='login'>login</ETLink>
      <ETLink to='about'>about</ETLink>
    </>
  );
}

function Login() {
  return <h1>Login 페이지 입니다</h1>;
}

function About() {
  return <h1>About 페이지 입니다</h1>;
}

export default App;

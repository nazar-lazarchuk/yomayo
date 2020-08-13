import r from './renderApp';
import createState from './createState';
import mount from './mount';
import update from './update';

function renderApp (...args) {
  const lifecycleMethods = {
    createState,
    mount,
    update,
  };

  return r(lifecycleMethods, ...args);
}

function createElement(tag, props, ...children) {
  return {
    tag,
    props: props || {},
    children: children || [],
  };
};

function createEffect() {
  // console.log('createEffect');
}

export {
  renderApp,
  createEffect,
  createElement,
};

export default createElement;

import i from './init';
import createState from './createState';
import mount from './mount';
import update from './update';

function init (...args) {
  const lifecycleMethods = {
    createState,
    mount,
    update,
  };

  return i(lifecycleMethods, ...args);
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
  init,
  createEffect,
  createElement,
};

export default createElement;

import createState from './createState';
import mount from './mount';
import update from './update';

/**
 * Кореневий вузол для апки
 * @type {HTMLElement}
 */
let rootNode = null;

function renderApp(selector, rootComponent) {
  if (rootNode) {
    return;
  }

  rootNode = document.querySelector(selector);

  // Розпаковуємо комопонент
  // TODO: перевірка на відсутність чого-небудь із даних
  const {
    state: { initialState, computedState },
    actions,
  } = rootComponent;
  const getVirtualDOM = rootComponent.render;

  const state = createState(initialState, computedState, handleUpdate);

  const bindedActions = getBindedActions(actions, state);

  const initialVDOM = getVirtualDOM({ ...state, ...bindedActions });

  /**
   * Змінна для актуального Virtual DOM
   * @type {Object}
   */
  let VDOM = initialVDOM;

  // генерація DOM в перший раз
  mount(rootNode, VDOM);

  console.log(state, VDOM);

  function handleUpdate() {
    const newVDOM = getVirtualDOM({ ...state, ...bindedActions });
    update(newVDOM, VDOM);
  
    VDOM = newVDOM;
  
    console.log('Змінився стан компонента!', VDOM);
  }
}

/**
 * Функція для привязки методів до контексту компонента
 * @param {Object} actions події
 * @param {ProxyConstructor} state стан компоненту
 * @returns {Object} 
 */
function getBindedActions(actions, state) {
  const result = {};

  Object.keys(actions).forEach(key => {
    result[key] = event => actions[key].call(state, event);
  });

  return result;
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

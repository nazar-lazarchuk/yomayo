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

  const state = createState(initialState, computedState, onUpdate);

  // привязую контекст екшнів до стейт-об'єкту
  const bindedActions = getBindedActions(actions, state);

  // створення initial Virtual DOM
  const initialVDOM = getVirtualDOM({ ...state, ...bindedActions });
  let VDOM = initialVDOM;

  // генерація справжніх тегів
  mount(rootNode, VDOM);

  console.log(state, VDOM);

  // при оновленні, знову рендеримо в DOM
  function onUpdate(newState) {
    console.log('Update');

    const newVDOM = getVirtualDOM({ ...state, ...bindedActions });
    update(newVDOM, VDOM);
  
    VDOM = newVDOM;
  
    console.log(VDOM);
  }
}

function getBindedActions(actions, state) {
  const result = {};

  Object.keys(actions).forEach(key => {
    result[key] = event => actions[key].call(state, event);
  });

  return result;
}

function createEffect() {
  // console.log('createEffect');
}

function createElement(tag, props, ...children) {
  return {
    tag,
    props: props || {},
    children: children || [],
  };
};

export {
  renderApp,
  createEffect,
  createElement,
};

export default createElement;

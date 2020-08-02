import createState from './createState';
import mount from './mount';
import { createVDOMByHTML } from './VNode';

/**
 * Кореневий вузол для апки
 * @type {HTMLElement}
 */
let rootNode = null;

function renderApp(selector, rootComponent) {
  // повністю рендеримо DOM лише в перший раз
  if (rootNode) {
    return;
  }

  rootNode = document.querySelector(selector);

  // Розпаковуємо комопонент
  // TODO: перевірка на відсутність чого-небудь із даних
  const {
    state: { initialState, computedState },
    actions,
    render,
  } = rootComponent;

  const state = createState(initialState, computedState, onUpdate);

  const view = mount(actions, render, rootNode, state);

  const VDOM = createVDOMByHTML(view);
  console.log(VDOM);

  // при оновленні, знову рендеримо в DOM
  // TODO: VirtualDOM
  function onUpdate(newState) {
    mount(actions, render, rootNode, newState);
  }
}

export { renderApp };

export function createEffect() {
  // console.log('createEffect');
}

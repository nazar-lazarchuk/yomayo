import { create } from './create';
import mount from './mount';

// кореневий вузол для апки
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
    render
  } = rootComponent;

  // створюємо стан компонента
  const state = create(initialState, computedState, onUpdate);

  // рендеримо його в DOM
  mount(actions, render, rootNode, state);

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

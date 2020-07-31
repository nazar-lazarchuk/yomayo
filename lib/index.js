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

  // створюємо стан компонента
  const state = create(rootComponent, onUpdate);

  // рендеримо його в DOM
  mount(rootComponent, rootNode, state);

  // при оновленні, знову рендеримо в DOM
  // TODO: VirtualDOM
  function onUpdate(newState) {
    mount(rootComponent, rootNode, newState);
  }
}

export { renderApp };

export function createEffect() {
  // console.log('createEffect');
}

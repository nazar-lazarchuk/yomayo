import { create } from './create';

// кореневий вузол для апки
let rootNode = null;

function renderApp(selector, rootComponent) {
  // повністю рендеримо DOM лише в перший раз
  if (rootNode) {
    return;
  }

  rootNode = document.querySelector(selector);

  // створюємо компонент і відразу рендеримо його в кореневий вузол
  create(rootComponent, rootNode);
}

export { renderApp };

export function createEffect() {
  console.log('createEffect');
}

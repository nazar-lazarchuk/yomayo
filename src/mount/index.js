import { setEventsHandler, processingEvents } from './DOMEventsHandler';

/**
 * Функція для першого рендеринга компонента в DOM
 * @param {Object} actions 
 * @param {Function<void>} render 
 * @param {HTMLElement} node 
 * @param {Object} state
 * @returns {string}
 */
function mount (actions, render, node, state) {
  const template = render(state);
  const [view, eventDataList] = processingEvents(template);

  // вставка в DOM
  node.innerHTML = view;

  // ініціалізація (відновлення) подій
  setEventsHandler(eventDataList, actions, state, node);

  console.log(state);
  return view;
}

export default mount;

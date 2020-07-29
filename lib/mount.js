import { setEventsHandler } from './DOMEventsHandler';

function mount (node, view, eventDataList, state, actions) {
  // вставка в DOM
  node.innerHTML = view;

  // ініціалізація (відновлення) подій
  setEventsHandler(eventDataList, actions, state, node);

  console.log(state);
}

export default mount;
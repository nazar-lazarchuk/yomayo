import { setEventsHandler, processingEvents } from './DOMEventsHandler';

function mount ({ actions, render }, node, state) {
  const template = render(state);
  const [view, eventDataList] = processingEvents(template);

  // вставка в DOM
  node.innerHTML = view;

  // ініціалізація (відновлення) подій
  setEventsHandler(eventDataList, actions, state, node);

  console.log(state);
}

export default mount;

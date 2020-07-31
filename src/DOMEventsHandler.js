// список всіх обробників подій з window
import DOMEvents from './DOMEvents.json';

const ATTRIBUTE_PREFIX = 'data-framework-event-'
let eventCount = 0;
/**
 * Функція для пошуку обробників подій (onclick="...", on...="...") та їх заміни на data-атрибут
 * @param {string} view
 * @returns {[string, Array<{ attribute: string, event: string, handler: string }>]} 
 */
function processingEvents(view) {
  const attributeRegex = /on(\w+)\=(\"|\')(.*)(\2)/;
  const result = [];

  let r;
  do {
    r = view.match(attributeRegex);
    if (!r) {
      break;
    }
    
    const attribute = ATTRIBUTE_PREFIX + eventCount;
    eventCount++;

    result.push({
      attribute,
      event: r[1],
      handler: r[3],
    });

    view = view.replace(r[0], attribute);
  } while (true);

  return [view, result];
}

/**
 * функція для виставлення обробників подій, яка повинна спрацьовувати після рендерингу вузла
 * @param {Array<{ attribute: string, event: string, handler: string }>} eventDataList 
 * @param {Object} actions component actions
 * @param {Object} state component state
 * @param {HTMLElement} node
 * @returns {void}
 */
function setEventsHandler(eventDataList, actions, state, node) {
  eventDataList.forEach(eventData => {
    const listener = node.querySelector(`[${eventData.attribute}]`);
    
    listener.addEventListener(eventData.event, (event) => {
      // якшо передано назву action, який повинен обробити, то викликаємо його явно
      // наприклад: onclick="doSmth"
      if (actions.hasOwnProperty(eventData.handler)) {
        actions[eventData.handler].call(state, event);
        return;
      }

      // TODO: зробити відпрацювання інлайн-методів з view
      // наприклад: onclick="() => doSmth()"
      // onclick="function(e) { console.log(e) }"
      console.warn('Ще не працює', eventData.handler);
    });
  });
}

export { processingEvents, setEventsHandler };

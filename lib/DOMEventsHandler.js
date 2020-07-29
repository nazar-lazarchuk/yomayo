// список всіх обробників подій з window
import DOMEvents from './DOMEvents.json';

const ATTRIBUTE_PREFIX = 'data-framework-event-'
let eventCount = 0;
/**
 * 
 * @param {string} view
 * @returns {[string, Array<{ attribute: string, event: string, handlerName: string>]} 
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
      handlerName: r[3],
    });

    view = view.replace(r[0], attribute);
  } while (true);

  return [view, result];
}

function setEventsHandler(eventDataList, actions, state, node) {
  eventDataList.forEach(eventData => {
    const listener = node.querySelector(`[${eventData.attribute}]`);
    
    listener.addEventListener(eventData.event, (event) => {
      // якшо передано назву action, який повинен обробити, то викликаємо його явно
      // наприклад: onclick="doSmth"
      if (actions.hasOwnProperty(eventData.handlerName)) {
        actions[eventData.handlerName].call(state, event);
        return;
      }

      // TODO: зробити відпрацювання інлайн-методів з view
      // наприклад: onclick="() => doSmth()"
      // onclick="function(e) { console.log(e) }"
      console.log(nativeHandler());
    });
  });
}

export { processingEvents, setEventsHandler };

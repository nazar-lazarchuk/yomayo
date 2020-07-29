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

function setEventsHandler(actions, state, node) {
  // перевіряю кожну подію на елементах
  DOMEvents.forEach((e) => {
    const listeners = node.querySelectorAll(`[${e}]`);

    listeners.forEach((l) => {
      // зберігаю значення функції в змінну
      const nativeHandler = l[e];
      // зберігаю ім'я функції в змінну
      const handlerName = l.getAttribute(e);

      // видаляємо атрибут з DOM
      l.removeAttribute(e);

      // ставимо обробник виклику
      l.addEventListener(e.substring('on'.length), (event) => {
        // якшо передано назву action, який повинен обробити, то викликаємо його явно
        // наприклад: onclick="doSmth"
        if (actions.hasOwnProperty(handlerName)) {
          actions[handlerName].call(state, event);
          return;
        }

        // TODO: зробити відпрацювання інлайн-методів з view
        // наприклад: onclick="() => doSmth()"
        // onclick="function(e) { console.log(e) }"
        console.log(nativeHandler());
      });
    });
  });
}

export { processingEvents, setEventsHandler };

/**
 * Функція для запису атрибута в межах фреймворка
 * @param {Node} el DOM-вузол
 * @param {string} name ім'я атрибута
 * @param {*} value значення атрибута
 */
export function setAttr(el, name, value) {
  if (name.startsWith('on') && name.toLowerCase() in window)
    el.addEventListener(name.toLowerCase().substr(2), value);
  else el.setAttribute(name, value.toString());
}

/**
 * Функція для видалення атрибута в межах фреймворка
 * @param {Node} el DOM-вузол
 * @param {string} name ім'я атрибута
 * @param {*} value значення атрибута
 */
export function removeAttr(el, name, value) {
  if (name.startsWith('on') && name.toLowerCase() in window)
    el.removeEventListener(name.toLowerCase().substr(2), value);
  else el.removeAttribute(name);
}

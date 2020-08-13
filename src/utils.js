export function setAttr(el, name, value) {
  if (name.startsWith('on') && name.toLowerCase() in window)
    el.addEventListener(name.toLowerCase().substr(2), value);
  else el.setAttribute(name, value.toString());
}

export function removeAttr(el, name, value) {
  if (name.startsWith('on') && name.toLowerCase() in window)
    el.removeEventListener(name.toLowerCase().substr(2), value);
  else el.removeAttribute(name);
}

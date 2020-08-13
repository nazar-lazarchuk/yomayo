import { setAttr } from '../utils';
/**
 * Функція для першого рендеринга компонента в DOM
 * @param {HTMLElement} node 
 * @param {Object} VDOM
 * @returns {void}
 */
function mount (node, VDOM) {
  if (VDOM === false || VDOM === null) return;

  if (typeof VDOM === 'object' && VDOM.tag) {
    const el = document.createElement(VDOM.tag);

    Object.entries(VDOM.props).forEach(([name, value]) => {
      setAttr(el, name, value);
    });

    VDOM.children.forEach(child => {
      mount(el, child)
    });

    VDOM.el = el;

    node.append(el);
    return;
  }

  node.append(VDOM);
  return;
}

export default mount;

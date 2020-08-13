import { setAttr } from '../utils';
/**
 * Функція для першого рендеринга компонента в DOM
 * @param {HTMLElement} node 
 * @param {Object} VDOM
 * @returns {void}
 */
function mount (node, VDOM, replaceNode) {
  if (VDOM === false || VDOM === null) {
    const el = document.createComment(' ');
    node.append(el);
    return;
  }

  if (typeof VDOM === 'object' && VDOM.tag) {
    const el = document.createElement(VDOM.tag);

    Object.entries(VDOM.props).forEach(([name, value]) => {
      setAttr(el, name, value);
    });

    VDOM.children.forEach(child => {
      mount(el, child)
    });

    VDOM.el = el;

    if (replaceNode) {
      node.replaceChild(el, replaceNode);
    } else {
      node.append(el);
    }
    return;
  }

  node.append(VDOM);
  return;
}

export default mount;

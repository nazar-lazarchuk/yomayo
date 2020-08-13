import { setAttr, removeAttr } from '../utils';

function updateRecursive(newVDOMFragment, previousVDOMFragment) {
  if (typeof newVDOMFragment !== 'object' || newVDOMFragment === null) {
    return newVDOMFragment;
  }

  if (newVDOMFragment.tag !== previousVDOMFragment.tag) {
    // тут видаляємо тег з previousVDOMFragment та створюємо новий в newVDOMFragment
    // та вішаємо на нього всі атрибути нового елемента
  } else {
    newVDOMFragment.el = previousVDOMFragment.el;
  }

  const previousProps = { ...previousVDOMFragment.props };
  // записуємо нові атрибути в елемент
  Object.entries(newVDOMFragment.props).forEach(([name, value]) => {
    if (previousProps[name] !== value) {
      setAttr(newVDOMFragment.el, name, value);
      delete previousProps[name];
    }
  });
  // видаляємо зайві атрибути
  Object.entries(previousProps).forEach(([name, value]) => {
    removeAttr(newVDOMFragment.el, name, value);
  });

  newVDOMFragment.children.forEach(child => {
    console.log(child);
  });

  return newVDOMFragment;
}

export default updateRecursive;

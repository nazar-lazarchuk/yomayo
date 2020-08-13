import { setAttr, removeAttr } from '../utils';
import mount from '../mount';

// TODO: key-атрибут для економії операцій
/**
 * 
 * @param {*} newVDOMFragment фрагмент або об'єкт VirtualDOM який буде змінювати VIEW
 * @param {*} previousVDOMFragment минулий фрагмент, з яким порівнюю
 */
function updateRecursive(newVDOMFragment, previousVDOMFragment) {
  if (typeof newVDOMFragment !== 'object' || newVDOMFragment === null) {
    return newVDOMFragment;
  }

  if (newVDOMFragment.tag !== previousVDOMFragment.tag) {
    // TODO: придумати тут логіку
    // тут видаляємо тег з previousVDOMFragment та створюємо новий в newVDOMFragment
    // та вішаємо на нього всі атрибути нового елемента
  } else {
    newVDOMFragment.el = previousVDOMFragment.el;
  }

  // тимчасова змінна-акумулятор
  const previousProps = { ...previousVDOMFragment.props };

  // записуємо нові атрибути в елемент
  Object.entries(newVDOMFragment.props).forEach(([name, value]) => {
    if (previousProps[name] !== value) {
      setAttr(newVDOMFragment.el, name, value);
    }
    delete previousProps[name];
  });

  // видаляємо зайві атрибути
  Object.entries(previousProps).forEach(([name, value]) => {
    removeAttr(newVDOMFragment.el, name, value);
  });

  // і тепер цикл по всім дочірнім елементам
  updateChildren(newVDOMFragment, previousVDOMFragment);
}

function updateChildren(newVDOMFragment, previousVDOMFragment) {
  for(let i = 0; i < newVDOMFragment.children.length; i++) {
    const n = newVDOMFragment.children[i];
    const p = previousVDOMFragment.children[i];

    if ((typeof n !== 'object' || n === null)) {
      if (n !== p) {
        if (n === false || n === null) {
          // якшо наш children є null || false, то замість нього в DOM добавляємо коментарій
          // роблю це, щоб зберегти порядок (індекси)
          if (newVDOMFragment.el.childNodes[i] !== Node.COMMENT_NODE) {
            const empty = document.createComment(' ');
            newVDOMFragment.el.replaceChild(empty, newVDOMFragment.el.childNodes[i]);
          }
        } else {
          const newNode = document.createTextNode(n);
          newVDOMFragment.el.replaceChild(newNode, newVDOMFragment.el.childNodes[i]);
        }
      } else if (n instanceof Function) {
        const newValue = n.toString();
        const oldValue = newVDOMFragment.el.childNodes[i].textContent;
        if (newValue !== oldValue) {
          newVDOMFragment.el.replaceChild(document.createTextNode(newValue), newVDOMFragment.el.childNodes[i]);
        }
      }
    } else {
      if (typeof p === 'object' && p !== null) {
        updateRecursive(n, p);
      } else {
        mount(newVDOMFragment.el, n, newVDOMFragment.el.childNodes[i]);
      }
    }
  };
}

export default updateRecursive;

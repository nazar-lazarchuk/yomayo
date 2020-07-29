// вузол для апки
let rootNode = null;

const COMPUTED_PREFIX = '$__computed__';
const COMPUTED_DEPS_KEY = '$__computed_deps__';

// останні залежності в computed
let LAST_COMPUTED_DEPS;

// необраховані computed-властивості, які необхідно підтягнути перед рендером
let COMPUTED_TO_CALCULATE;

function renderApp(selector, rootComponent) {
  // повністю рендеримо DOM лише в перший раз
  if (rootNode) {
    return;
  }

  rootNode = document.querySelector(selector);

  const {
    state: { initialState, computedState },
  } = rootComponent;

  const state = { ...initialState };

  state[COMPUTED_DEPS_KEY] = {};

  const proxyState = createProxy(state, rootComponent, (property) => {
    // перераховуємо лише ті значення computed, які мають залежність від змінених данних
    let obj = {};
    function getTreeRecursive(property) {
      const deps = proxyState[COMPUTED_DEPS_KEY][property];

      if (deps?.length > 0) {
        deps.forEach(d => {
          obj[d] = true;

          getTreeRecursive(d);
        })
      }
    }
    getTreeRecursive(property);
    COMPUTED_TO_CALCULATE = Object.keys(obj);

    // а тут йде повнорний рендеринг уже зі зміненими данними
    render(proxyState, rootNode, rootComponent);
    setDOMEvents();

    console.log(proxyState);
  });

  setComputedProperties(proxyState, computedState);

  // оновлення DOM-подій
  function setDOMEvents() { 
    const { actions } = rootComponent;
    setActions(actions, proxyState);
  }

  render(proxyState, rootNode, rootComponent);
  setDOMEvents();

  console.log(proxyState);
}

function setComputedProperties(state, computedState) {
  COMPUTED_TO_CALCULATE = Object.keys(computedState);

  // вираховую залежності computedState від state та самого ж computedState
  Object.keys(computedState).forEach((key) => {
    const caller = computedState[key].bind(state);

    let isFirstCalculated = false;
    // якщо computed викликає computed, то треба побудувати дерево залежностей та правильно обчислити результат
    // тут переоприділяю toString, бо computed буде виводитися у view
    caller.toString = function () {
      // назва спец-властивості
      const computedValueKey = COMPUTED_PREFIX + key;

      // якщо значення уже обраховане, то повернути його
      if (!COMPUTED_TO_CALCULATE.includes(key)) {
        return state[computedValueKey];
      }

      const calculate = () => {
        // вираховуємо значення computed
        // прибираємо його зі списку невирахуваних значень
        COMPUTED_TO_CALCULATE.splice(COMPUTED_TO_CALCULATE.indexOf(key), 1);

        // рахуємо значення
        const result = this();

        // зберегти знайдене значення в як окрему властивість
        // TODO прибрати цю хєрню в окремий об'єкт, бо тут воно нахуй не потрібно
        state[computedValueKey] = result;

        return result;
      }

      // при першому обрахунку потрібно зробити дерево залежностей, а при наступних просто обраховувати
      const value = isFirstCalculated ? calculate() : createComputedDependencies(key, state, calculate);

      isFirstCalculated = true;
      return value;
    };

    function createComputedDependencies(key, state, calculate) {
      let lastDeps;
      let deps;

      if (LAST_COMPUTED_DEPS instanceof Array) {
        LAST_COMPUTED_DEPS.push(key);
      }
      // знаходимо залежності або створюємо нові
      deps = state[COMPUTED_DEPS_KEY][key] || [];

      lastDeps = LAST_COMPUTED_DEPS;
      LAST_COMPUTED_DEPS = deps;

      const result = calculate();

      deps.forEach(depsKey => {
        if (state[COMPUTED_DEPS_KEY].hasOwnProperty(depsKey)) {
          state[COMPUTED_DEPS_KEY][depsKey].push(key);
        } else {
          state[COMPUTED_DEPS_KEY][depsKey] = [key];
        }
      })
      LAST_COMPUTED_DEPS = lastDeps;

      return result;
    }

    state[key] = caller;
  });

  // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
  // TODO: обрахунок після зміни стану по дереву залежностей
  while (COMPUTED_TO_CALCULATE.length) {
    const key = COMPUTED_TO_CALCULATE[0];
    state[key].toString();
  }
}
function setActions(actions, state) {
  // витягую всі можливі обробники подій з window
  const events = [];
  for (const e in window) {
    if (/^on/.test(e)) events.push(e);
  }

  // перевіряю кожен з них на елементах
  events.forEach(e => {
    const listeners = rootNode.querySelectorAll(`[${e}]`);

    listeners.forEach((l) => {
      // зберігаємо значення функції в змінну
      const nativeHandler = l[e];
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

function createProxy(state, rootComponent, onChange) {
  const { state: { initialState, computedState } } = rootComponent;

  function pushDeps(property) {
    if (LAST_COMPUTED_DEPS instanceof Array) {
      LAST_COMPUTED_DEPS.push(property);
    }
  }

  const proxy = new Proxy(state, {
    get(target, property) {
      if (Object.keys(initialState).includes(property)) {
        pushDeps(property);
      }
      return target[property];
    },
    set(target, property, value) {
      // тут сетаєм реактивні дані
      if (Object.keys(initialState).includes(property)) {
        target[property] = value;
        onChange(property);
        return true;
      }

      // TODO: зробити нормальну перевірку для першого запису computed
      const c = Object.keys(computedState);
      // перевірка на запис самого computed
      const isComputedSet = c.includes(property) && value instanceof Function;
      // перевірка на запис обрахованого значення
      // TODO прибрати його взагалі з проксі-об'єкта, він тут нахуй не потрібен
      const isComputedValueSet = property.indexOf(COMPUTED_PREFIX) === 0 && c.includes(property.substring(COMPUTED_PREFIX.length));

      if (isComputedSet || isComputedValueSet) {
        target[property] = value;
        return true;
      }

      console.error(`Властивість ${property} тільки для читання!`);
      return false;
    }
  })

  return proxy;
}

// TODO: тут треба зробити VirtualDom
function render(state, root, component) {
  root.innerHTML = component.render(state);
}

export { renderApp };

export function createEffect() {
  console.log('createEffect');
}

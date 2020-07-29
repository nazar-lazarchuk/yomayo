// вузол для апки
let rootNode = null;

const STATE_PREFIX = '$__state__';
const COMPUTED_PREFIX = '$__computed__';
const COMPUTED_DEPS_KEY = '$__computed_deps__';

// останні залежності в computed
let LAST_COMPUTED_DEPS;

function renderApp(selector, rootComponent) {
  // виконається при першому запуску renderApp
  if (!rootNode) {
    rootNode = document.querySelector(selector);
    const state = getInitialState(rootComponent);
    
    console.log(state);

    // рендеринг додатку
    // TODO: тут треба зробити VirtualDom
    rootNode.innerHTML = rootComponent.render(state);

    const { actions } = rootComponent;

    setActions(actions, state);
  }
}

function getInitialState(rootComponent) {
  const {
    state: { initialState, computedState },
  } = rootComponent;

  const state = { ...initialState };

  state[COMPUTED_DEPS_KEY] = {};

  setStateProperties(state);

  setComputedProperties(state, computedState);

  return state;
}

function setStateProperties(state) {
  Object.keys(state).forEach((key) => {
    if (key === COMPUTED_DEPS_KEY) {
      return;
    }

    const stateValueKey = STATE_PREFIX + key;

    // записуємо initialValue в окрему властивість stateValueKey
    state[stateValueKey] = state[key];

    // TODO: тут потрібен Proxy для запису та відслідковування
    state[key] = () => state[stateValueKey];

    // при зчитуванні властивості повертаємо значення
    state[key].valueOf = function () {
      // якщо існує масив залежностей, то добавляємо в нього ключ
      // TODO: ця річ повинна працювати одноразово, при created
      const l = LAST_COMPUTED_DEPS;
      if (l instanceof Array && !l.includes(key)) {
        l.push(key);
      }

      return state[stateValueKey];
    };
  });
}
function setComputedProperties(state, computedState) {
  const computedToCalculate = Object.keys(computedState);

  // вираховую залежності computedState від state та самого ж computedState
  Object.keys(computedState).forEach((key) => {
    const caller = computedState[key].bind(state);

    // якщо computed викликає computed, то треба побудувати дерево залежностей та правильно обчислити результат
    // тут переоприділяю toString, бо computed буде виводитися у view
    caller.toString = function () {
      // назва спец-властивості
      const computedValueKey = COMPUTED_PREFIX + key;

      // якщо значення уже обраховане, то повернути його
      if (!computedToCalculate.includes(key)) {
        return state[computedValueKey];
      }

      // перевіряємо та зберігаємо залежності
      const lastDeps = LAST_COMPUTED_DEPS;

      if (lastDeps instanceof Array) {
        lastDeps.push(key);
      }

      // знаходимо залежності або створюємо нові
      const deps = state[COMPUTED_DEPS_KEY][key] || [];
      LAST_COMPUTED_DEPS = deps;

      // вираховуємо значення computed перший раз
      // прибираємо його зі списку невирахуваних значень
      computedToCalculate.splice(computedToCalculate.indexOf(key), 1);

      // рахуємо значення
      const value = this();

      // ставимо дерево залежностей
      deps.forEach(depsKey => {
        if (state[COMPUTED_DEPS_KEY].hasOwnProperty(depsKey)) {
          state[COMPUTED_DEPS_KEY][depsKey].push(key);
        } else {
          state[COMPUTED_DEPS_KEY][depsKey] = [key];
        }
      })
      LAST_COMPUTED_DEPS = lastDeps;
      
      // зберегти знайдене значення в як окрему властивість
      state[computedValueKey] = value;

      return value;
    };

    state[key] = caller;
  });

  // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
  // TODO: обрахунок після зміни стану по дереву залежностей
  while (computedToCalculate.length) {
    const key = computedToCalculate[0];
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

export { renderApp };

export function createEffect() {
  console.log('createEffect');
}

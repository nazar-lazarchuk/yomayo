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
    initFirstRender(rootComponent);
  }
}

function initFirstRender(rootComponent) {
  const {
    state: { initialState, computedState },
  } = rootComponent;

  const state = { ...initialState };

  state[COMPUTED_DEPS_KEY] = {};

  setStateProperties(state);

  setComputedProperties(state, computedState);

  console.log(state);

  // рендеринг додатку
  // TODO: тут треба зробити VirtualDom
  rootNode.innerHTML = rootComponent.render(state);
}

function setStateProperties(state) {
  Object.keys(state).forEach((key) => {
    if (key === COMPUTED_DEPS_KEY) {
      return;
    }

    const stateValueKey = STATE_PREFIX + key;

    // записуємо initialValue в окрему властивість stateValueKey
    state[stateValueKey] = state[key];

    // тут потрібен Proxy для запису та відслідковування
    state[key] = () => state[stateValueKey];

    // при зчитуванні властивості повертаємо значення
    state[key].valueOf = function () {
      // якщо існує масив залежностей, то добавляємо в нього ключ
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

    // якщо computed викликає computed, то треба побудувати дерево залежностей
    // та правильно обчислити результат
    caller.toString = function () {
      // назва спец-властивості
      const computedValueKey = COMPUTED_PREFIX + key;

      // якщо значення уже обраховане, то повернути його
      if (state.hasOwnProperty(computedValueKey)) {
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

      state[COMPUTED_DEPS_KEY][key] = deps;
      LAST_COMPUTED_DEPS = lastDeps;
      
      // зберегти знайдене значення в як окрему властивість
      state[computedValueKey] = value;

      return value;
    };

    state[key] = caller;
  });

  // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
  // TODO обрахунок після зміни стану
  while (computedToCalculate.length) {
    const key = computedToCalculate[0];
    computedToCalculate.splice(computedToCalculate.indexOf(key), 1);

    state[key].toString();
  }
}

export { renderApp };

export function createEffect() {
  console.log('createEffect');
}

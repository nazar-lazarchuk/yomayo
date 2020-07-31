import {
  createDependenciesArray,
  initObservableComputedDependencies,
  initIncalculableComputed,
  createProxy,
} from './utils';

const {
  getObsCompDependencies,
  setObsCompDependencies,
  addObsCompDependency,
} = initObservableComputedDependencies();

const {
  getIncalculableComputedKeys,
  setIncalculableComputedKeys,
} = initIncalculableComputed();

function create(initialState, computedState, onUpdate) {
  // інкапсульовані дані computed-обрахунку
  const COMPUTED_VALUES = {};

  // дерево залежностей computed від state
  const COMPUTED_DEPS = {};

  const propertyChangeObserver = (property) => {
    setIncalculableComputedKeys(createDependenciesArray(COMPUTED_DEPS, property));
    onUpdate(state);
  };

  const state = createProxy(
    // будуємо проксі на копію initialState
    { ...initialState },

    // обробник зміни властивості
    property => dispatchPropertyGetObserver(property, initialState),

    // обробник запису властивості
    ({ target, property, value }) => {
      const isPropertyReactive = Object.keys(initialState).includes(property);

      if (isPropertyReactive) {
        target[property] = value;

        // виконуємо каллбек на зміну властивості
        propertyChangeObserver(property);
        return true;
      }

      const isProperyComputed = Object.keys(computedState).includes(property)
        && typeof target[property] === 'undefined' 
        && value instanceof Function;

      if (isProperyComputed) {
        target[property] = value;
        return true;
      }

      console.error(`Властивість ${property} тільки для читання!`);
      return false;
    },
  );

  setComputedProperties(state, computedState, COMPUTED_DEPS, COMPUTED_VALUES);

  return state;
}

function dispatchPropertyGetObserver(property, initialState) {
  if (Object.keys(initialState).includes(property)) {
    addObsCompDependency(property);
  }
}

function setComputedProperties(state, computedState, COMPUTED_DEPS, COMPUTED_VALUES) {
  setIncalculableComputedKeys(Object.keys(computedState));

  // вираховую залежності computedState від state та самого ж computedState
  Object.keys(computedState).forEach((key) => {
    const caller = computedState[key].bind(state);

    let isFirstCalculated = false;
    // якщо computed викликає computed, то треба побудувати дерево залежностей та правильно обчислити результат
    // тут переоприділяю toString, бо computed буде виводитися у view
    caller.toString = function () {
      // якщо значення уже обраховане, то повернути його
      if (!getIncalculableComputedKeys().includes(key)) {
        return COMPUTED_VALUES[key];
      }

      const calculate = () => {
        // вираховуємо значення computed
        // прибираємо його зі списку невирахуваних значень
        const c = getIncalculableComputedKeys();
        c.splice(c.indexOf(key), 1);
        setIncalculableComputedKeys(c);

        // рахуємо значення
        const result = this();

        // зберегти знайдене значення в як окрему властивість
        COMPUTED_VALUES[key] = result;

        return result;
      }

      // при першому обрахунку потрібно зробити дерево залежностей, а при наступних просто обраховувати
      const value = isFirstCalculated ? calculate() : createComputedDependencies(key, calculate, COMPUTED_DEPS);

      isFirstCalculated = true;
      return value;
    };

    state[key] = caller;
  });

  // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
  while (getIncalculableComputedKeys().length) {
    const key = getIncalculableComputedKeys()[0];
    state[key].toString();
  }
}

function createComputedDependencies(key, calculate, globalDependencies) {
  // додаємо поточний computed в список залежностей вверхнього рівня
  addObsCompDependency(key);

  // зберігаємо залежності верхнього рівня
  const lastDeps = getObsCompDependencies();

  // знаходимо або створюємо масив залежностей даного рівня
  setObsCompDependencies(globalDependencies[key] || []);

  // рахуємо результат обчислення computed-властивості
  // важливо! даний обрахунок викликає зміну стану ObservableComputedDependencies
  const result = calculate();

  // знаходимо ланцюжок викликів та зберігаємо його
  getObsCompDependencies().forEach(depsKey => {
    if (globalDependencies.hasOwnProperty(depsKey)) {
      globalDependencies[depsKey].push(key);
    } else {
      globalDependencies[depsKey] = [key];
    }
  })

  setObsCompDependencies(lastDeps);

  return result;
}

export { create };

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

/**
 * Функція для створення стану компонента
 * @param {Object} initialState 
 * @param {Object} computedState 
 * @param {Function<void>} onUpdate 
 * @returns {Object}
 */
function createState(initialState, computedState, onUpdate) {
  /**
   * інкапсульовані дані computed-обрахунку
   * @type {Object}
   */
  const COMPUTED_VALUES = {};

  /**
   * дерево залежностей computed від state
   * @type {Object}
   */
  const COMPUTED_DEPS = {};

  const propertyChangeObserver = (property) => {
    setIncalculableComputedKeys(createDependenciesArray(COMPUTED_DEPS, property));
    onUpdate(state);
  };

  const state = createProxy(
    // будуємо проксі з копії initialState
    { ...initialState },

    // обробник зміни властивості
    property => {
      // хендлимо Observer якщо змінився стан компонента
      if (Object.keys(initialState).includes(property)) {
        addObsCompDependency(property);
      }
    },

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
        // перший запис computed-властивості в компоненті
        target[property] = value;
        return true;
      }

      console.error(`Властивість ${property} тільки для читання!`);
      return false;
    },
  );

  const initComputedTreeOnce = (property, calculate) => {
    return createComputedDependenciesTree(COMPUTED_DEPS, property, calculate);
  }

  const getComputedValue = key => COMPUTED_VALUES[key];
  const setComputedValue = (key, value) => COMPUTED_VALUES[key] = value;

  // записати та обрахувати computed-властивості у state
  setComputedProperties(
    state,
    computedState,
    initComputedTreeOnce,
    getComputedValue,
    setComputedValue
  );

  return state;
}

function setComputedProperties(state, computedState, initComputedTreeOnce, getComputedValue, setComputedValue) {
  setIncalculableComputedKeys(Object.keys(computedState));

  // вираховую залежності computedState від state та самого ж computedState
  Object.keys(computedState).forEach((key) => {
    const caller = computedState[key].bind(state);

    caller.toString = getValue;
    caller.valueOf = getValue;
    
    let isFirstCalculated = false;

    // Якщо значення ще не обраховане, то перший раз обовязково рахуємо
    // в іншому випадку повертаємо попередній результат.
    function getValue () {
      if (!getIncalculableComputedKeys().includes(key)) {
        return getComputedValue(key);
      }

      // вираховуємо значення computed
      const calculate = () => {
        // прибираємо його зі списку невирахуваних значень
        const c = getIncalculableComputedKeys();
        c.splice(c.indexOf(key), 1);
        setIncalculableComputedKeys(c);

        // рахуємо значення
        const result = this();

        // зберегти знайдене значення в як окрему властивість
        setComputedValue(key, result);

        return result;
      }

      // при першому обрахунку потрібно зробити дерево залежностей, а при наступних просто обраховувати
      const value = isFirstCalculated
        ? calculate()
        : initComputedTreeOnce(key, calculate);

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

function createComputedDependenciesTree(target, property, calculate) {
  // додаємо поточний computed в список залежностей вверхнього рівня
  addObsCompDependency(property);

  // зберігаємо залежності верхнього рівня
  const lastDeps = getObsCompDependencies();

  // знаходимо або створюємо масив залежностей даного рівня
  setObsCompDependencies(target[property] || []);

  // рахуємо результат обчислення computed-властивості
  // важливо! даний обрахунок викликає зміну стану ObservableComputedDependencies
  const result = calculate();

  // знаходимо ланцюжок викликів та зберігаємо його
  getObsCompDependencies().forEach(depsKey => {
    if (target.hasOwnProperty(depsKey)) {
      target[depsKey].push(property);
    } else {
      target[depsKey] = [property];
    }
  })

  setObsCompDependencies(lastDeps);

  return result;
}

export default createState;

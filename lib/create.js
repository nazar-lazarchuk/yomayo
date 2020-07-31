import { createDependenciesArray, initObservableComputedDependencies, initIncalculableComputed } from './utils';

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

  const state = createProxy({ ...initialState }, initialState, computedState, (property) => {
    setIncalculableComputedKeys(createDependenciesArray(COMPUTED_DEPS, property));

    onUpdate(state );
  });

  setComputedProperties(state, computedState);

  function setComputedProperties(state, computedState) {
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
        const value = isFirstCalculated ? calculate() : createComputedDependencies(key, calculate);

        isFirstCalculated = true;
        return value;
      };

      function createComputedDependencies(key, calculate) {
        // додаємо поточний computed в список залежностей вверхнього рівня
        addObsCompDependency(key);

        // зберігаємо залежності верхнього рівня
        const lastDeps = getObsCompDependencies();

        // знаходимо або створюємо масив залежностей даного рівня
        setObsCompDependencies(COMPUTED_DEPS[key] || []);

        // рахуємо результат обчислення computed-властивості
        // важливо! даний обрахунок викликає зміну стану ObservableComputedDependencies
        const result = calculate();

        // знаходимо ланцюжок викликів та зберігаємо його
        getObsCompDependencies().forEach(depsKey => {
          if (COMPUTED_DEPS.hasOwnProperty(depsKey)) {
            COMPUTED_DEPS[depsKey].push(key);
          } else {
            COMPUTED_DEPS[depsKey] = [key];
          }
        })

        setObsCompDependencies(lastDeps);

        return result;
      }

      state[key] = caller;
    });

    // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
    while (getIncalculableComputedKeys().length) {
      const key = getIncalculableComputedKeys()[0];
      state[key].toString();
    }
  }

  function createProxy(state, initialState, computedState, onChange) {
    const proxy = new Proxy(state, {
      get(target, property) {
        if (Object.keys(initialState).includes(property)) {
          addObsCompDependency(property);
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

        // перевірка на запис самого computed
        if (Object.keys(computedState).includes(property) && value instanceof Function) {
          target[property] = value;
          return true;
        }

        console.error(`Властивість ${property} тільки для читання!`);
        return false;
      }
    })

    return proxy;
  }

  return state;
}

export { create };

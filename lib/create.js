import { createDependenciesArray } from './utils';
import { processingEvents, setEventsHandler } from './DOMEventsHandler';

function create(component, node) {
  // інкапсульовані дані computed-обрахунку
  const COMPUTED_VALUES = {};

  // дерево залежностей computed від state
  const COMPUTED_DEPS = {};

  // останні залежності в computed
  let LAST_COMPUTED_DEPS;

  // необраховані computed-властивості, які необхідно підтягнути перед рендером
  let COMPUTED_TO_CALCULATE;

  const {
    state: { initialState, computedState },
    actions,
  } = component;

  const proxyState = createProxy({ ...initialState }, component, (property) => {
    COMPUTED_TO_CALCULATE = createDependenciesArray(COMPUTED_DEPS, property);

    const template = component.render(proxyState);
    const [view, eventDataList] = processingEvents(template);
    // а тут йде повнорний рендеринг уже зі зміненими данними
    // TODO: тут треба зробити VirtualDom
    node.innerHTML = view;

    setEventsHandler(eventDataList, actions, proxyState, node);

    console.log(proxyState);
  });

  setComputedProperties(proxyState, computedState);

  const template = component.render(proxyState);
  const [view, eventDataList] = processingEvents(template);

  // вставка в DOM
  node.innerHTML = view;

  // ініціалізація (відновлення) подій
  setEventsHandler(eventDataList, actions, proxyState, node);

  console.log(proxyState);

  function setComputedProperties(state, computedState) {
    COMPUTED_TO_CALCULATE = Object.keys(computedState);

    // вираховую залежності computedState від state та самого ж computedState
    Object.keys(computedState).forEach((key) => {
      const caller = computedState[key].bind(state);

      let isFirstCalculated = false;
      // якщо computed викликає computed, то треба побудувати дерево залежностей та правильно обчислити результат
      // тут переоприділяю toString, бо computed буде виводитися у view
      caller.toString = function () {
        // якщо значення уже обраховане, то повернути його
        if (!COMPUTED_TO_CALCULATE.includes(key)) {
          return COMPUTED_VALUES[key];
        }

        const calculate = () => {
          // вираховуємо значення computed
          // прибираємо його зі списку невирахуваних значень
          COMPUTED_TO_CALCULATE.splice(COMPUTED_TO_CALCULATE.indexOf(key), 1);

          // рахуємо значення
          const result = this();

          // зберегти знайдене значення в як окрему властивість
          COMPUTED_VALUES[key] = result;

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
        deps = COMPUTED_DEPS[key] || [];

        lastDeps = LAST_COMPUTED_DEPS;
        LAST_COMPUTED_DEPS = deps;

        const result = calculate();

        deps.forEach(depsKey => {
          if (COMPUTED_DEPS.hasOwnProperty(depsKey)) {
            COMPUTED_DEPS[depsKey].push(key);
          } else {
            COMPUTED_DEPS[depsKey] = [key];
          }
        })
        LAST_COMPUTED_DEPS = lastDeps;

        return result;
      }

      state[key] = caller;
    });

    // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
    while (COMPUTED_TO_CALCULATE.length) {
      const key = COMPUTED_TO_CALCULATE[0];
      state[key].toString();
    }
  }

  function createProxy(state, component, onChange) {
    const { state: { initialState, computedState } } = component;

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
}

export { create };

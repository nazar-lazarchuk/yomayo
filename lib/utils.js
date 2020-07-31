/**
 * Функція для обрахування залежностей
 * Приклад:
 * { fistName: ['fullName', 'test'], fullName: ['test'] }, 'fullName' ['test']
 * @param {Object} target
 * @param {string} property
 * @returns {Array<string>}
 */
export function createDependenciesArray(target, property) {
  const obj = {};

  function recursiveCaller(p) {
    const deps = target[p];

    if (deps?.length > 0) {
      deps.forEach((d) => {
        obj[d] = true;

        recursiveCaller(d);
      });
    }
  }
  
  recursiveCaller(property);

  const result = Object.keys(obj);
  return result;
}

/**
 * Функція для відслідковування computed-залежностей
 * повертає методи для роботи зі змінною-масивом
 * 
 */
export const initObservableComputedDependencies = function () {
  let OBSERVABLE_DEPS = [];

  return {
    getObsCompDependencies: () => [...OBSERVABLE_DEPS],
    setObsCompDependencies: (value) => OBSERVABLE_DEPS = [...value],
    addObsCompDependency: (dep) => {
      if (OBSERVABLE_DEPS instanceof Array) {
        OBSERVABLE_DEPS.push(dep);
      } else {
        OBSERVABLE_DEPS = [dep];
      }
    },
  };
};

/**
 * Функція для запису необрахованих значень computed-властивостей
 * повертає методи для роботи зі змінною-масивом
 */
export const initIncalculableComputed = function () {
  let COMPUTED_TO_CALCULATE = [];

  return {
    getIncalculableComputedKeys: () => [...COMPUTED_TO_CALCULATE],
    setIncalculableComputedKeys: (value) => COMPUTED_TO_CALCULATE = [...value],
  };
};

/**
 * Функція для отримання проксі-обгортки
 * @returns {Proxy} проксі-обгортка state
 */
export function createProxy(state, dispatchGetObserver, handleSet) {
  return new Proxy(state, {
    get(target, property) {
      dispatchGetObserver(property);

      return target[property];
    },
    set(target, property, value) {
      return handleSet({ target, property, value });
    }
  });
}

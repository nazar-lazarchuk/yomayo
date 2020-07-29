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

let rootNode = null;

export function renderApp(selector, rootComponent) {
  // при першому запуску, необхідно знайти та зберегти кореневий вузол
  if (!rootNode) {
    rootNode = document.querySelector(selector);
  }

  const { state: { initialState, computedState } } = rootComponent;

  // ключ для останніх залежностей в initialState
  const lastDepsKey = '$__last_deps__';

  Object.keys(initialState).forEach(key => {
    const stateValueKey = '$__state__' + key;

    // записуємо initialValue в окрему властивість stateValueKey
    initialState[stateValueKey] = initialState[key];

    // тут потрібен Proxy для запису та відслідковування
    initialState[key] = () => initialState[stateValueKey];

    initialState[key].valueOf = function() {
      const lastDeps = initialState[lastDepsKey];

      if (lastDeps instanceof Array && !lastDeps.includes(key)) {
        lastDeps.push(key);
      }

      return initialState[stateValueKey];
    }
  });

  // всі computed-значення, які необхідно обрахувати
  const compKeys = Object.keys(computedState);

  // вираховую залежності computedState від initialState та самого ж computedState
  compKeys.forEach(key => {
    const caller = computedState[key].bind(initialState);

    // якщо computed викликає computed, то треба побудувати дерево залежностей
    // та правильно обчислити результат
    caller.toString = function() {
      // назва спец-властивості
      const computedValueKey = '$__computed__' + key;

      // назва властивості з залежностями
      const computedDepsKey = '$__computed_deps__' + key;

      // якщо значення уже обраховане, то повернути його
      if (initialState.hasOwnProperty(computedValueKey)) {
        return initialState[computedValueKey];
      }

      // вираховуємо значення computed перший раз
      // прибираємо його зі списку невирахуваних значень
      compKeys.splice(compKeys.indexOf(key), 1);
      // оголошуємо йому масив залежностей
      initialState[computedDepsKey] = [];

      // зберігаємо останній результат
      const lastDeps = initialState[lastDepsKey];
      // якшо lastDeps це масив, то значить що даний computed є в залежностях іншого
      if (lastDeps instanceof Array && !lastDeps.includes(key)) {
        lastDeps.push(key);
      }
      // створюємо свій масив залежностей
      initialState[lastDepsKey] = initialState[computedDepsKey];
      // рахуємо значення
      const value = this();
      // зберігаємо масив залежностей
      initialState[computedDepsKey] = initialState[lastDepsKey];

      // повертаємо минулий стан
      initialState[lastDepsKey] = lastDeps;
      if (typeof lastDeps === 'undefined') {
        delete initialState[lastDepsKey];
      }

      // зберегти знайдене значення в як окрему властивість
      initialState[computedValueKey] = value;

      return value;
    }

    initialState[key] = caller;
  });
  
  // запускаю ПЕРШИЙ обрахунок кожної вичислювальної властивості
  // TODO обрахунок після зміни стану
  while (compKeys.length) {
    const key = compKeys[0];
    compKeys.splice(compKeys.indexOf(key), 1);

    initialState[key].toString();
  }

  console.log(initialState);

  // рендеринг додатку
  // TODO: тут треба зробити VirtualDom
  rootNode.innerHTML = rootComponent.render(initialState);
};

export function createEffect() {
  console.log('createEffect');
};

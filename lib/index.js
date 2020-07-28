let rootNode = null;

export function renderApp(selector, rootComponent) {
  // при першому запуску, необхідно знайти та зберегти кореневий вузол
  if (!rootNode) {
    rootNode = document.querySelector(selector);
  }

  const { state: { initialState, computedState } } = rootComponent;

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

      // якщо значення уже обраховане, то повернути його
      if (initialState.hasOwnProperty(computedValueKey)) {
        return initialState[computedValueKey];
      }

      // вирахувати значення computed перший раз
      compKeys.splice(compKeys.indexOf(key), 1);
      const value = this();

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

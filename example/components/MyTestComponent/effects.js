// файл із сайд-еффектами

// функціонал по аналогії з react/useEffect,
// але хотів би добавити:
// 1) можливість робити всі операції до виклику template (render)
// 2) пропу для скасування першого запуску функції (шось тіпа postpone: bool третім параметром в createEffect)

import { createEffect } from 'my-framework';

// виклик при створенні компоненту
const testAjax = createEffect(() => {
  fetch('/test_api')
    .then((res) => res.json())
    .then((res) => res.data)
    .then((data) => {
      this.address = data.address;
    });
}, () => []);


// створення виклику таймауту, який буде спрацьовувати при зміні значення this.count
const effect1 = createEffect(() => {
  const tId = setTimeout(() => console.log(`count changed: ${this.count}`), 2000);
  return () => clearTimeout(tId);
}, state => [state.count]);


export default [effect1, testAjax];

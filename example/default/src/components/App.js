import jsx from 'yomayo/jsx';

import { appDataLayer } from '../store';
const { addData, get } = appDataLayer;

export default () => {
  // Створення об'єкту в глобальному сховищі
  const text = addData('Hello world');

  // отримати формат для виводу в темплейт
  const $text = get(text);

  return (
    <div>
      <h1>{$text}</h1>
      <button onClick={() => text.set('Work')}>Change text</button>
    </div>
  );
}

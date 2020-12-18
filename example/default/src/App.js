import { jsx } from 'yomayo';
/** @jsx jsx */

import { appDataLayer } from './store';
const { addData, get } = appDataLayer;

const text = addData('Hello world');
const $text = get(text);

export default (
  <div>
    <h1>{$text}</h1>
    <button onClick={() => text.set('Work')}>Change text</button>
  </div>
);

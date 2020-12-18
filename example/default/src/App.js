import { jsx } from 'yomayo';
/** @jsx jsx */

import { appDataLayer } from './store';
const { addData, get } = appDataLayer;

const text = addData('Hello world');
const $text = get(text);

export default <h1 onClick={() => text.set('Work')}>{$text}</h1>;

import { App, jsx } from 'yomayo';
/** @jsx jsx */

import { store } from './store.js';

import AppComponent from './App.js';

export default App(store)(<AppComponent />)

import { App } from 'yomayo';
import { store } from './store.js';

import AppComponent from './App.js';

export default App(store)(AppComponent)

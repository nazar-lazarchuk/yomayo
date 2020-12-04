import { App } from 'yomayo';

import AppStore from './Store.js';
import AppComponent from './App.js';

export default new App({
  rootComponent: AppComponent,
  rootStore: AppStore,
});

import { createStore, StoreModule } from 'yomayo';

export const appDataLayer = new StoreModule();

export const store = createStore([
  appDataLayer,
  // ...,
]);

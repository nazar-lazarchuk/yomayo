export const App = (store: any) => (render: any) => {
  return { store, render };
};

export const createStore = (modules: any[]) => {
  return { modules };
};

export { StoreModule } from './storeModule';

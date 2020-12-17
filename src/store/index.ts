export const App = (store: any) => (render: any) => {
  console.log(store);
  console.log(render);
};

export const createStore = (modules: any[]) => {
  console.log('createStore', modules);
};

export { StoreModule } from './storeModule';

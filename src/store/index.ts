import { IStore } from './types';

export const createStore = (modules: any[]): IStore => {
  return { modules };
};

export { StoreModule } from './storeModule';

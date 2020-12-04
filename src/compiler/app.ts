import { ComponentType } from './types';

interface IAppOptions {
  rootComponent: () => ComponentType;
  rootStore: any;
}

export const App = (options: IAppOptions) => {
  const { rootComponent, rootStore } = options;
  console.log(rootComponent());
  console.log(rootStore);
};

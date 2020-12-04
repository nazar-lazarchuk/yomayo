import { uid } from 'uid';

import { FrameworkType } from './types';

interface IContext {
  setData: SetData;
}
type SetData = (initialData: { [key: string]: any }) => SetDataOutput;
type SetDataOutput = { [key: string]: FrameworkType };

const setData: SetData = (initialData) => {
  if (typeof initialData !== 'object' || !initialData) {
    throw new Error(
      'Invalid initialData at setData hook! InitialData must be an object!'
    );
  }

  let result: SetDataOutput = {};

  Object.keys(initialData).forEach((key) => {
    result[key] = {
      $$type: 'data',
      $$value: initialData[key],
      $$id: uid(),
    };
  });

  return result;
}

function getContext(): IContext {
  // тут створити id контексту під Store
  return { setData };
}

export const Store = (options: any) => {
  console.log(options);

  return { getContext };
};

import { uid } from 'uid';

import {
  Writable,
  IStoreDataFormat,
  IStoreModule,
  IRenderDataFormat,
} from './index.types';

export class StoreModule implements IStoreModule {
  readonly key = uid();
  readonly data: { [key: string]: IStoreDataFormat } = {};
  readonly computed = {};

  addData = (initialValue: any) => {
    const key = uid();
    this.data[key] = {
      key,
      value: initialValue,
    };

    const writable: Writable = {
      key,
      set() {
        console.log('set');
      },
      update() {
        console.log('update');
      },
    };

    return writable;
  };

  get = (writable: Writable): IRenderDataFormat => {
    const { key } = this.data[writable.key];
    return { key };
  };
}

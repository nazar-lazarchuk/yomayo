import { uid } from 'uid';

import {
  Writable,
  IStoreModule,
  IRenderDataFormat,
} from './index.types';

export class StoreModule implements IStoreModule {
  readonly key = uid();
  readonly data = {} as { [key: string]: any };
  readonly computed = {};

  addData = (initialValue: any) => {
    const key = uid();
    this.data[key] = initialValue;

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
    return { key: this.key + '_' + writable.key };
  };
}

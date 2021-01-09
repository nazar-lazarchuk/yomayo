import { IStore } from '../../store/types';
import { Listener } from './getListeners';

type GetListenerFC = (listener: Listener) => void;

export type RenderCallback = (
  render: any,
  store: IStore,
  getListeners: GetListenerFC
) => string;

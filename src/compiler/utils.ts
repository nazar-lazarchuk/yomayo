import { ComponentType } from './types';

export function createElement(tag: any, props: any, ...children: any): ComponentType {
  return {
    tag,
    props: props || {},
    children: children || [],
  };
}

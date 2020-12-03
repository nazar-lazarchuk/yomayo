export function createElement(tag: any, props: any, ...children: any) {
  return {
    tag,
    props: props || {},
    children: children || [],
  };
}

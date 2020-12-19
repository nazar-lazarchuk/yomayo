export function createElement(tag: any, props: any, ...children: any) {
  if (typeof tag === 'function') return tag(props, children);

  return {
    tag,
    props: props || {},
    children: children || [],
  };
}

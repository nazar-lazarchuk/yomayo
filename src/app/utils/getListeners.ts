export type Listener = { key: string; event: string; listener(e?: any): any };

export function isListener(propsName: string): boolean {
  return (
    !!propsName &&
    propsName.startsWith('on') &&
    propsName[2] === propsName[2].toUpperCase()
  );
}

export function parseRealListenerName(propsName: string): string {
  const event = propsName.substring(2);
  return event.slice(0, 1).toLowerCase() + event.slice(1);
}

import htmlTags from 'html-tags';
import voidHtmlTags from 'html-tags/void';
import { uid } from 'uid';
//
import { Listener, isListener, parseRealListenerName } from './getListeners';

type GetListenerFC = (listener: Listener) => void;

export function renderInitialDocumentLayout(render: any, getListeners: GetListenerFC): string {
  return '<!DOCTYPE html>' + renderHtmlRecursively(render, getListeners);
}

function renderHtmlRecursively(render: any, getListeners: GetListenerFC): string {
  if (typeof render === 'object' && render.tag) {
    return renderTagProjection(render, getListeners);
  }

  if (typeof render === 'string') return render;

  // TODO: get initial value from store
  if (typeof render === 'object' && render.key) {
    return render.key;
  }

  return '';
}

function renderTagProjection(render: any, getListeners: GetListenerFC): string {
  let listenerKey: string = '';

  const listeners: string[] = Object.keys(render.props)
    .filter(key => isListener(key));

  if (listeners.length) {
    listenerKey = ` data-y-${uid()}`;

    listeners.forEach((propsName: string) => {
      getListeners({
        key: listenerKey,
        event: parseRealListenerName(propsName),
        listener: render.props[propsName],
      });
    });
  }

  const attributes: string = Object.keys(render.props)
    .filter(key => !isListener(key))
    .reduce((acc: string, key: any) => acc += ` ${key}="${render.props[key].toString()}"`, '');

  if (voidHtmlTags.includes(render.tag)) {
    return `<${render.tag}${attributes}${listenerKey}>`;
  }

  if (htmlTags.includes(render.tag)) {
    return (
      `<${render.tag}${attributes}${listenerKey}>` + 
        render.children.reduce((acc: string, c: any) => acc += renderHtmlRecursively(c, getListeners), '') +
      `</${render.tag}>`
    );
  }

  throw new Error(`Tag '${render.tag}' does not exists`);
}

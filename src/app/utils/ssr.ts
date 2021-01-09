import htmlTags from 'html-tags';
import voidHtmlTags from 'html-tags/void';
import { uid } from 'uid';
//
import { isListener, parseRealListenerName } from './getListeners';
//
import { RenderCallback } from './ssr.types';

const renderProjectionOfTag: RenderCallback = (render, store, getListeners) => {
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
        render.children.reduce((acc: string, c: any) => acc += renderHtmlRecursively(c, store, getListeners), '') +
      `</${render.tag}>`
    );
  }

  throw new Error(`Tag '${render.tag}' does not exist`);
}

const renderHtmlRecursively: RenderCallback = (render, store, getListeners) => {
  if (typeof render === 'object' && render.tag) {
    return renderProjectionOfTag(render, store, getListeners);
  }

  if (typeof render === 'string') return render;

  // TODO: redesign modules functionality
  if (typeof render === 'object' && render.key) {
    const [moduleKey, dataKey] = render.key.split('_');
    const module = store.modules.find(m => m.key === moduleKey);
    if (!module) return '';
    return module.data[dataKey];
  }

  // false, 0, null, NaN values
  if (!render) return '';

  if (render && render.toString) return render.toString();

  return '';
}

export const renderInitialDocumentLayout: RenderCallback = (...args) => {
  return '<!DOCTYPE html>' + renderHtmlRecursively(...args);
};

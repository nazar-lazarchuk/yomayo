"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = void 0;
function createElement(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if (typeof tag === 'function')
        return tag(props, children);
    return {
        tag: tag,
        props: props || {},
        children: children || [],
    };
}
exports.createElement = createElement;

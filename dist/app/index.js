"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
var createApp = function (store) { return function (render) {
    return { store: store, render: render };
}; };
exports.createApp = createApp;

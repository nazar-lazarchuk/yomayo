"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var App = function (store) { return function (render) {
    return { store: store, render: render };
}; };
exports.App = App;

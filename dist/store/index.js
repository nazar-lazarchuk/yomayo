"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = exports.createStore = void 0;
var createStore = function (modules) {
    return { modules: modules };
};
exports.createStore = createStore;
var storeModule_1 = require("./storeModule");
Object.defineProperty(exports, "StoreModule", { enumerable: true, get: function () { return storeModule_1.StoreModule; } });

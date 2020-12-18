"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModule = void 0;
var uid_1 = require("uid");
var StoreModule = /** @class */ (function () {
    function StoreModule() {
        var _this = this;
        this.key = uid_1.uid();
        this.data = {};
        this.computed = {};
        this.addData = function (initialValue) {
            var key = uid_1.uid();
            _this.data[key] = initialValue;
            var writable = {
                key: key,
                set: function () {
                    console.log('set');
                },
                update: function () {
                    console.log('update');
                },
            };
            return writable;
        };
        this.get = function (writable) {
            return { key: _this.key + '_' + writable.key };
        };
    }
    return StoreModule;
}());
exports.StoreModule = StoreModule;

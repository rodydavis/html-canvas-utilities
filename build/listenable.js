"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listenable = void 0;
var Listenable = /** @class */ (function () {
    function Listenable() {
        this.listeners = [];
    }
    Listenable.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    Listenable.prototype.removeListener = function (listener) {
        this.listeners = this.listeners.filter(function (l) { return l !== listener; });
    };
    Listenable.prototype.notifyListeners = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this);
        }
    };
    return Listenable;
}());
exports.Listenable = Listenable;
//# sourceMappingURL=listenable.js.map
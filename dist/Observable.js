"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple oberserable implementation.
 */
var Observable = /** @class */ (function () {
    /**
     * Creates a new obserable.
     * @param opts Options
     */
    function Observable(opts) {
        if (opts === void 0) { opts = {}; }
        this._observers = [];
        this._opts = opts;
    }
    Observable.prototype.addObserver = function (o) {
        this._observers.push(o);
    };
    Observable.prototype.removeObserver = function (o) {
        var idx = this._observers.indexOf(o);
        if (idx !== -1) {
            this._observers.splice(idx, 1);
            return true;
        }
        return false;
    };
    /**
     * Invokes all observers with the event data.
     * @param value The event.
     */
    Observable.prototype.invoke = function (value) {
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var o = _a[_i];
            o(value);
        }
    };
    return Observable;
}());
exports.default = Observable;

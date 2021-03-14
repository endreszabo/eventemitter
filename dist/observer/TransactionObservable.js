"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allows to emit events in a transaction. Once the transaction is done, all events are flattened and released at once.
 * For this reason the observers must accept arrays of the event type.
 */
var TransactionObservable = /** @class */ (function () {
    function TransactionObservable() {
        this._observers = [];
        this._transaction = null;
    }
    TransactionObservable.prototype.addObserver = function (o) {
        this._observers.push(o);
    };
    TransactionObservable.prototype.removeObserver = function (o) {
        var idx = this._observers.indexOf(o);
        if (idx !== -1) {
            this._observers.splice(idx, 1);
            return true;
        }
        return false;
    };
    /**
     * If in transaction adds the given event to the list of events emitted in this transaction.
     * Otherwise the event handlers are called right away.
     * @param value The event value.
     */
    TransactionObservable.prototype.invoke = function (value) {
        if (this._transaction) {
            this._transaction.push(value);
        }
        else {
            this.invokeWith([value]);
        }
    };
    /**
     * Invokes the obserable with many event values.
     * @param values The event values.
     */
    TransactionObservable.prototype.invokeMany = function (values) {
        var _a;
        if (this._transaction) {
            (_a = this._transaction).push.apply(_a, values);
        }
        else {
            this.invokeWith(values);
        }
    };
    /**
     * Runs a transaction. All invokes called during this transaction will be accumulated until the transaction
     * function has ran to completion. Afterwards the observers will be called.
     * If an error occurs during the function all values will be discarded.
     * @param fn The transaction function.
     */
    TransactionObservable.prototype.transaction = function (fn) {
        if (this._transaction) {
            fn();
        }
        else {
            this._transaction = [];
            var values = [];
            try {
                fn();
                values = this._transaction;
            }
            catch (error) {
                throw error;
            }
            finally {
                this._transaction = null;
            }
            if (values.length > 0) {
                this.invokeWith(values);
            }
        }
    };
    /**
     * Runs a transaction asychronously. See the transaction function for details.
     * @param fn The transaction function.
     */
    TransactionObservable.prototype.transactionAsync = function (fn) {
        return __awaiter(this, void 0, void 0, function () {
            var values, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._transaction) return [3 /*break*/, 2];
                        return [4 /*yield*/, fn()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        this._transaction = [];
                        values = [];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, 6, 7]);
                        return [4 /*yield*/, fn()];
                    case 4:
                        _a.sent();
                        values = this._transaction;
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6:
                        this._transaction = null;
                        return [7 /*endfinally*/];
                    case 7:
                        if (values.length > 0) {
                            this.invokeWith(values);
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TransactionObservable.prototype.invokeWith = function (t) {
        for (var _i = 0, _a = this._observers; _i < _a.length; _i++) {
            var o = _a[_i];
            o(t);
        }
    };
    return TransactionObservable;
}());
exports.default = TransactionObservable;

"use strict";
/**
 * Gets all own properties and symbols.
 * @param e The object.
 */
var getAllOwn = function (e) {
    var names = Object.getOwnPropertyNames(e);
    // Feature detect symbols
    var symbols = "getOwnPropertySymbols" in Object ? Object.getOwnPropertySymbols(e) : [];
    var res = [];
    return res.concat(symbols).concat(names);
};
/**
 * The priority of an event. The lower the value the high the priority.
 */
var Priority;
(function (Priority) {
    Priority[Priority["HIGHEST"] = -1000] = "HIGHEST";
    Priority[Priority["HIGHER"] = -100] = "HIGHER";
    Priority[Priority["HIGH"] = -10] = "HIGH";
    Priority[Priority["NORMAL"] = 0] = "NORMAL";
    Priority[Priority["LOW"] = 10] = "LOW";
    Priority[Priority["LOWER"] = 100] = "LOWER";
    Priority[Priority["LOWEST"] = 1000] = "LOWEST";
})(Priority || (Priority = {}));
/**
 * The sahnee event emitter class. You can either instatiate it directly or subclass it.
 */
var SahneeEventEmitter = /** @class */ (function () {
    function SahneeEventEmitter() {
        this._events = {};
    }
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    SahneeEventEmitter.prototype.eventNames = function () {
        return getAllOwn(this._events);
    };
    /**
     * Return the listeners registered for a given event.
     */
    SahneeEventEmitter.prototype.listeners = function (event) {
        var events = this._events[event];
        return events ? events.map(function (e) { return e.fn; }) : [];
    };
    /**
     * Return the number of listeners listening to a given event.
     */
    SahneeEventEmitter.prototype.listenerCount = function (event) {
        var events = this._events[event];
        return events ? events.length : 0;
    };
    /**
     * Calls each of the listeners registered for a given event.
     */
    SahneeEventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var events = this._events[event];
        if (!events || !events.length) {
            return false;
        }
        for (var i = 0; i < events.length; i++) {
            var currentEvent = events[i];
            currentEvent.fn.apply(currentEvent.context, args);
            if (currentEvent.once) {
                events.splice(i, 1);
                i--;
            }
        }
        return true;
    };
    /**
     * Add a listener for a given event.
     */
    SahneeEventEmitter.prototype.on = function (event, fn, context, priority) {
        if (priority === void 0) { priority = 0; }
        return this.addListener(event, fn, context, priority);
    };
    /**
     * Add a listener for a given event.
     */
    SahneeEventEmitter.prototype.addListener = function (event, fn, context, priority) {
        if (priority === void 0) { priority = 0; }
        var events = this._events[event] || [];
        events.push({ context: context, fn: fn, priority: priority, once: false });
        this.sort(events);
        this._events[event] = events;
        return this;
    };
    /**
     * Add a one-time listener for a given event.
     */
    SahneeEventEmitter.prototype.once = function (event, fn, context, priority) {
        if (priority === void 0) { priority = 0; }
        var events = this._events[event] || [];
        events.push({ context: context, fn: fn, priority: priority, once: true });
        this.sort(events);
        this._events[event] = events;
        return this;
    };
    /**
     * Remove the listeners of a given event.
     */
    SahneeEventEmitter.prototype.removeListener = function (event, fn, context, once, priority) {
        var events = this._events[event];
        if (events) {
            for (var i = 0; i < events.length; i++) {
                var currentEvent = events[i];
                if (currentEvent.fn === fn
                    && (context === undefined || currentEvent.context === context)
                    && (once === undefined || currentEvent.once === once)
                    && (priority === undefined || currentEvent.priority === priority)) {
                    events.splice(i, 1);
                }
            }
        }
        return this;
    };
    SahneeEventEmitter.prototype.off = function (event, fn, context, once) {
        this.removeListener(event, fn, context, once);
    };
    /**
     * Remove all listeners, or those of the specified event.
     */
    SahneeEventEmitter.prototype.removeAllListeners = function (event) {
        if (event) {
            delete this._events[event];
        }
        else {
            this._events = {};
        }
    };
    SahneeEventEmitter.prototype.sort = function (events) {
        events.sort(function (a, b) { return a.priority - b.priority; });
    };
    SahneeEventEmitter.Priority = Priority;
    return SahneeEventEmitter;
}());
module.exports = SahneeEventEmitter;

"use strict";
var PREFIX = "~";
/**
 * Gets all own properties and symbols.
 * @param e The object.
 */
var getAllOwn = function (e) {
    var names = Object.getOwnPropertyNames(e);
    // Feature detect symbols
    var myObject = Object;
    var symbols = myObject.getOwnPropertySymbols ? myObject.getOwnPropertySymbols(e) : [];
    var res = [];
    return res.concat(names).concat(symbols);
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
        /**
         * The actual event storage.
         */
        this._events = {};
        /**
         * The prefix used by this emitter.
         */
        this.prefix = SahneeEventEmitter.prefixed;
    }
    Object.defineProperty(SahneeEventEmitter.prototype, "_eventsCount", {
        /**
         * Only exists for compatibility with eventemitter3 unit tests.
         */
        get: function () {
            return getAllOwn(this._events).length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    SahneeEventEmitter.prototype.eventNames = function () {
        var _this = this;
        return getAllOwn(this._events).map(function (e) { return _this.unPrefix(e); });
    };
    /**
     * Return the listeners registered for a given event.
     */
    SahneeEventEmitter.prototype.listeners = function (event) {
        event = this.doPrefix(event);
        var events = this._events[event];
        return events ? events.map(function (e) { return e.fn; }) : [];
    };
    /**
     * Return the number of listeners listening to a given event.
     */
    SahneeEventEmitter.prototype.listenerCount = function (event) {
        event = this.doPrefix(event);
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
        event = this.doPrefix(event);
        var events = this._events[event];
        if (!events || !events.length) {
            return false;
        }
        for (var i = 0; i < events.length; i++) {
            var currentEvent = events[i];
            if (currentEvent.once) {
                events.splice(i, 1);
                i--;
            }
            currentEvent.fn.apply(currentEvent.context, args);
        }
        if (events.length === 0) {
            delete this._events[event];
        }
        return true;
    };
    /**
     * Add a listener for a given event.
     */
    SahneeEventEmitter.prototype.on = function (event, fn, context, priority) {
        if (priority === void 0) { priority = 0; }
        return this.addListener(event, fn, context, false, priority);
    };
    /**
     * Add a one-time listener for a given event.
     */
    SahneeEventEmitter.prototype.once = function (event, fn, context, priority) {
        if (priority === void 0) { priority = 0; }
        return this.addListener(event, fn, context, true, priority);
    };
    /**
     * Add a listener for a given event.
     */
    SahneeEventEmitter.prototype.addListener = function (event, fn, context, once, priority) {
        if (priority === void 0) { priority = 0; }
        if (typeof fn !== "function") {
            throw new TypeError('The listener must be a function');
        }
        event = this.doPrefix(event);
        var events = this._events[event] || [];
        events.push({ context: context, fn: fn, priority: priority, once: !!once });
        this.sort(events);
        this._events[event] = events;
        return this;
    };
    /**
     * Remove the listeners of a given event.
     */
    SahneeEventEmitter.prototype.off = function (event, fn, context, once) {
        this.removeListener(event, fn, context, once);
    };
    /**
     * Remove the listeners of a given event.
     */
    SahneeEventEmitter.prototype.removeListener = function (event, fn, context, once, priority) {
        if (!fn) {
            this.removeAllListeners(event);
        }
        else {
            event = this.doPrefix(event);
            var events = this._events[event];
            if (events) {
                for (var i = 0; i < events.length; i++) {
                    var currentEvent = events[i];
                    if (currentEvent.fn === fn
                        && (!context || currentEvent.context === context)
                        && (!once || currentEvent.once === once)
                        && (!priority || currentEvent.priority === priority)) {
                        events.splice(i, 1);
                        i--;
                    }
                }
                if (events.length === 0) {
                    delete this._events[event];
                }
            }
        }
        return this;
    };
    /**
     * Remove all listeners, or those of the specified event.
     */
    SahneeEventEmitter.prototype.removeAllListeners = function (event) {
        if (event) {
            event = this.doPrefix(event);
            delete this._events[event];
        }
        else {
            this._events = {};
        }
        return this;
    };
    /**
     * Adds the prefix to the given event name.
     * @param name The event name.
     */
    SahneeEventEmitter.prototype.doPrefix = function (name) {
        if (typeof name === "string" && this.prefix) {
            return this.prefix + name;
        }
        return name;
    };
    /**
     * Removes the prefix from the given event name.
     * @param name The event name.
     */
    SahneeEventEmitter.prototype.unPrefix = function (name) {
        if (typeof name === "string" && this.prefix) {
            return name.slice(this.prefix.length);
        }
        return name;
    };
    /**
     * Sorts the given listener list.
     * @param events The list.
     */
    SahneeEventEmitter.prototype.sort = function (events) {
        events.sort(function (a, b) { return a.priority - b.priority; });
    };
    /**
     * Allow `EventEmitter` to be imported as module namespace.
     */
    SahneeEventEmitter.EventEmitter = SahneeEventEmitter;
    /**
     * The priority of an event. The lower the value the high the priority.
     */
    SahneeEventEmitter.Priority = Priority;
    /**
     * Expose the prefix.
     */
    SahneeEventEmitter.prefixed = PREFIX;
    return SahneeEventEmitter;
}());
module.exports = SahneeEventEmitter;

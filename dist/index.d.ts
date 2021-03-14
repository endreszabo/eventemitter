interface ListenerFn {
    (...args: any[]): void;
}
/**
 * The priority of an event. The lower the value the high the priority.
 */
declare enum Priority {
    HIGHEST = -1000,
    HIGHER = -100,
    HIGH = -10,
    NORMAL = 0,
    LOW = 10,
    LOWER = 100,
    LOWEST = 1000
}
/**
 * The sahnee event emitter class. You can either instatiate it directly or subclass it.
 */
declare class SahneeEventEmitter<EventTypes extends string | symbol = string | symbol> {
    /**
     * Allow `EventEmitter` to be imported as module namespace.
     */
    static EventEmitter: typeof SahneeEventEmitter;
    /**
     * The priority of an event. The lower the value the high the priority.
     */
    static Priority: typeof Priority;
    /**
     * Expose the prefix.
     */
    static prefixed: string | false;
    /**
     * The actual event storage.
     */
    private _events;
    /**
     * The prefix used by this emitter.
     */
    prefix: string | false;
    /**
     * Only exists for compatibility with eventemitter3 unit tests.
     */
    protected get _eventsCount(): number;
    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     */
    eventNames(): EventTypes[];
    /**
     * Return the listeners registered for a given event.
     */
    listeners(event: EventTypes): ListenerFn[];
    /**
     * Return the number of listeners listening to a given event.
     */
    listenerCount(event: EventTypes): number;
    /**
     * Calls each of the listeners registered for a given event.
     */
    emit(event: EventTypes, ...args: any[]): boolean;
    /**
     * Add a listener for a given event.
     */
    on(event: EventTypes, fn: ListenerFn, context?: any, priority?: number): this;
    /**
     * Add a one-time listener for a given event.
     */
    once(event: EventTypes, fn: ListenerFn, context?: any, priority?: number): this;
    /**
     * Add a listener for a given event.
     */
    addListener(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean, priority?: number): this;
    /**
     * Remove the listeners of a given event.
     */
    off(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean): void;
    /**
     * Remove the listeners of a given event.
     */
    removeListener(event: EventTypes, fn?: ListenerFn, context?: any, once?: boolean, priority?: number): this;
    /**
     * Remove all listeners, or those of the specified event.
     */
    removeAllListeners(event?: EventTypes): this;
    /**
     * Adds the prefix to the given event name.
     * @param name The event name.
     */
    private doPrefix;
    /**
     * Removes the prefix from the given event name.
     * @param name The event name.
     */
    private unPrefix;
    /**
     * Sorts the given listener list.
     * @param events The list.
     */
    private sort;
}
export = SahneeEventEmitter;
//# sourceMappingURL=index.d.ts.map
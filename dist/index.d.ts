interface ListenerFn {
    (...args: any[]): void;
}
/**
 * The sahnee event emitter class. You can either instatiate it directly or subclass it.
 */
declare class SahneeEventEmitter<EventTypes extends string | symbol = string | symbol> {
    private _events;
    constructor();
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
     * Add a listener for a given event.
     */
    addListener(event: EventTypes, fn: ListenerFn, context?: any, priority?: number): this;
    /**
     * Add a one-time listener for a given event.
     */
    once(event: EventTypes, fn: ListenerFn, context?: any, priority?: number): this;
    /**
     * Remove the listeners of a given event.
     */
    removeListener(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean, priority?: number): this;
    off(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean): void;
    /**
     * Remove all listeners, or those of the specified event.
     */
    removeAllListeners(event?: EventTypes): void;
    private sort;
}
export = SahneeEventEmitter;
//# sourceMappingURL=index.d.ts.map
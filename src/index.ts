type EventNames<T extends string | symbol | { [K in string | symbol]: any[] }> = T extends string | symbol ? T : keyof T;
type EventArgs<T extends string | symbol | { [K in string | symbol]: any[] }, K extends EventNames<T>> = T extends string | symbol ? any[] : K extends keyof T ? T[K] : never;

interface Listener {
  fn: ListenerFn;
  once: boolean;
  context: any;
  priority: number;
}

interface ListenerFn {
  (...args: any[]): void;
}

/**
 * Gets all own properties and symbols.
 * @param e The object.
 */
const getAllOwn = <T>(e: { [key in string | symbol]: T[] }) => {
  const names = Object.getOwnPropertyNames(e);
  // Feature detect symbols
  const symbols = "getOwnPropertySymbols" in Object ? (Object as any).getOwnPropertySymbols(e) : [];
  const res: (string | symbol)[] = [];
  return res.concat(symbols).concat(names);
}

/**
 * The priority of an event. The lower the value the high the priority.
 */
enum Priority {
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
class SahneeEventEmitter<EventTypes extends string | symbol = string | symbol> {
  private _events: { [key in string | symbol]: Listener[] } = {};

  static Priority = Priority;

  constructor() {
  }

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  public eventNames(): EventTypes[] {
    return getAllOwn(this._events) as EventTypes[];
  }

  /**
   * Return the listeners registered for a given event.
   */
  public listeners(event: EventTypes): ListenerFn[] {
    const events = this._events[event];
    return events ? events.map(e => e.fn) : [];
  }

  /**
   * Return the number of listeners listening to a given event.
   */
  public listenerCount(event: EventTypes): number {
    const events = this._events[event];
    return events ? events.length : 0;
  }

  /**
   * Calls each of the listeners registered for a given event.
   */
  public emit(event: EventTypes, ...args: any[]): boolean {
    const events = this._events[event];
    if (!events || !events.length) {
      return false;
    }
    for (let i = 0; i < events.length; i++) {
      const currentEvent = events[i];
      currentEvent.fn.apply(currentEvent.context, args);
      if (currentEvent.once) {
        events.splice(i, 1);
        i--;
      }
    }
    return true;
  }

  /**
   * Add a listener for a given event.
   */
  public on(event: EventTypes, fn: ListenerFn, context?: any, priority = 0) {
    return this.addListener(event, fn, context, priority);
  }

  /**
   * Add a listener for a given event.
   */
  public addListener(event: EventTypes, fn: ListenerFn, context?: any, priority = 0) {
    const events: Listener[] = this._events[event] || [];
    events.push({ context: context, fn: fn, priority: priority, once: false });
    this.sort(events);
    this._events[event] = events;
    return this;
  }

  /**
   * Add a one-time listener for a given event.
   */
  public once(event: EventTypes, fn: ListenerFn, context?: any, priority = 0) {
    const events = this._events[event] || [];
    events.push({ context: context, fn: fn, priority: priority, once: true });
    this.sort(events);
    this._events[event] = events;
    return this;
  }

  /**
   * Remove the listeners of a given event.
   */
  public removeListener(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean, priority?: number) {
    const events = this._events[event];
    if (events) {
      for (let i = 0; i < events.length; i++) {
        const currentEvent = events[i];
        if (currentEvent.fn === fn 
          && (context === undefined || currentEvent.context === context) 
          && (once === undefined || currentEvent.once === once) 
          && (priority === undefined || currentEvent.priority === priority)) {
            events.splice(i, 1);
        }
      }
    }
    return this;
  }

  public off(event: EventTypes, fn: ListenerFn, context?: any, once?: boolean) {
    this.removeListener(event, fn, context, once);
  }

  /**
   * Remove all listeners, or those of the specified event.
   */
  public removeAllListeners(event?: EventTypes) {
    if (event) {
      delete this._events[event];
    } else {
      this._events = {};
    }
  }

  private sort(events: Listener[]) {
    events.sort((a, b) => a.priority - b.priority);
  }
}

export = SahneeEventEmitter;

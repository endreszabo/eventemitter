import IObservable, { Observer } from './IObservable';

/**
 * Some options
 */
interface IOpts {
  /**
   * Ignore listener errors when invoking the observer.
   */
  // ignoreListenerError?: boolean;
}

/**
 * A simple oberserable implementation.
 */
export default class Observable<T> implements IObservable<T> {
  private _observers: Observer<T>[] = [];
  private _opts: IOpts;

  /**
   * Creates a new obserable.
   * @param opts Options
   */
  constructor(opts: IOpts = {}) {
    this._opts = opts;
  }

  public addObserver(o: Observer<T>) {
    this._observers.push(o);
  }

  public removeObserver(o: Observer<T>) {
    const idx = this._observers.indexOf(o);
    if (idx !== -1) {
      this._observers.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Invokes all observers with the event data.
   * @param value The event.
   */
  public invoke(value: T) {
    for (const o of this._observers) {
      o(value);
    }
  }
}

import IObservable, { Observer } from './IObservable';
/**
 * Some options
 */
interface IOpts {
}
/**
 * A simple oberserable implementation.
 */
export default class Observable<T> implements IObservable<T> {
    private _observers;
    private _opts;
    /**
     * Creates a new obserable.
     * @param opts Options
     */
    constructor(opts?: IOpts);
    addObserver(o: Observer<T>): void;
    removeObserver(o: Observer<T>): boolean;
    /**
     * Invokes all observers with the event data.
     * @param value The event.
     */
    invoke(value: T): void;
}
export {};
//# sourceMappingURL=Observable.d.ts.map
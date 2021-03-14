import IObservable, { Observer } from './IObservable';
/**
 * Allows to emit events in a transaction. Once the transaction is done, all events are flattened and released at once.
 * For this reason the observers must accept arrays of the event type.
 */
export default class TransactionObservable<T> implements IObservable<T[]> {
    private _observers;
    private _transaction;
    addObserver(o: Observer<T[]>): void;
    removeObserver(o: Observer<T[]>): boolean;
    /**
     * If in transaction adds the given event to the list of events emitted in this transaction.
     * Otherwise the event handlers are called right away.
     * @param value The event value.
     */
    invoke(value: T): void;
    /**
     * Invokes the obserable with many event values.
     * @param values The event values.
     */
    invokeMany(values: T[]): void;
    /**
     * Runs a transaction. All invokes called during this transaction will be accumulated until the transaction
     * function has ran to completion. Afterwards the observers will be called.
     * If an error occurs during the function all values will be discarded.
     * @param fn The transaction function.
     */
    transaction(fn: (() => void)): void;
    /**
     * Runs a transaction asychronously. See the transaction function for details.
     * @param fn The transaction function.
     */
    transactionAsync(fn: (() => Promise<void>)): Promise<void>;
    private invokeWith;
}
//# sourceMappingURL=TransactionObservable.d.ts.map
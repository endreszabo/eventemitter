import IObservable, { Observer } from './IObservable';

/**
 * Allows to emit events in a transaction. Once the transaction is done, all events are flattened and released at once.
 * For this reason the observers must accept arrays of the event type.
 */
export default class TransactionObservable<T> implements IObservable<T[]> {
  private _observers: Observer<T[]>[] = [];
  private _transaction: T[] | null = null;

  public addObserver(o: Observer<T[]>) {
    this._observers.push(o);
  }

  public removeObserver(o: Observer<T[]>) {
    const idx = this._observers.indexOf(o);
    if (idx !== -1) {
      this._observers.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * If in transaction adds the given event to the list of events emitted in this transaction. 
   * Otherwise the event handlers are called right away.
   * @param value The event value. 
   */
  public invoke(value: T) {
    if (this._transaction) {
      this._transaction.push(value);
    } else {
      this.invokeWith([value]);
    }
  }

  /**
   * Invokes the obserable with many event values.
   * @param values The event values.
   */
  public invokeMany(values: T[]) {
    if (this._transaction) {
      this._transaction.push(...values);
    } else {
      this.invokeWith(values);
    }
  }

  /**
   * Runs a transaction. All invokes called during this transaction will be accumulated until the transaction 
   * function has ran to completion. Afterwards the observers will be called.
   * If an error occurs during the function all values will be discarded.
   * @param fn The transaction function.
   */
  public transaction(fn: (() => void)) {
    if (this._transaction) {
      fn();
    } else {
      this._transaction = [];
      let values: T[] = [];
      try {
        fn();
        values = this._transaction;
      } catch(error) {
        throw error;
      } finally {
        this._transaction = null;
      }
      if (values.length > 0) {
        this.invokeWith(values);
      }
    }
  }

  /**
   * Runs a transaction asychronously. See the transaction function for details.
   * @param fn The transaction function.
   */
  public async transactionAsync(fn: (() => Promise<void>)) {
    if (this._transaction) {
      await fn();
    } else {
      this._transaction = [];
      let values: T[] = [];
      try {
        await fn();
        values = this._transaction;
      } catch(error) {
        throw error;
      } finally {
        this._transaction = null;
      }
      if (values.length > 0) {
        this.invokeWith(values);
      }
    }
  }

  private invokeWith(t: T[]) {
    for (const o of this._observers) {
      o(t);
    }
  }
}

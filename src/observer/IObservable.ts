export type Observer<T> = (value: T) => void;

/**
 * An interface to implement obserables on.
 */
export default interface IObservable<T> {
  /**
   * Adds a new observer to the observable.
   * @param o The observer to add.
   */
  addObserver(o: Observer<T>): void;

  /**
   * Removes a previously added observer. Returns if the observer was removed.
   * @param o The observer.
   */
  removeObserver(o: Observer<T>): boolean;
}

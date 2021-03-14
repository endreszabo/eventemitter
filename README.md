# @sahnee/eventemitter

Yet another EventEmitter

## Features

* Classic subscription based event emitter class
* Observer pattern
* Written in TypeScript
* Fully unit tested

## EventEmitter

The `EventEmitter` is the main usage of this library. You can either use it as a standalone class instance of inherit your own classes form it.

It features all basic functions of an event emitter:

```js
import EventEmitter from '@sahnee/eventemitter';

const ee = new EventEmitter();
ee.on('my-event', args => console.log('Event:', args));
ee.emit('my-event', 1);
ee.emit('my-event', 2);
// Prints:
// - Event: 1
// - Event: 2
```

All supported functions and properties are. Parameters marked with `?` are optional:

* `prefix` - A prefix used for non symbol events to avoid e.g. prototype pollution. By default `'~'`.
* `eventNames()` - The names of all currently registered events.
* `listeners(event)` - Gets all listeners of the given event.
* `listenerCount(event)` - Gets amount of listeners for the given event.
* `emit(event, ...args)` - Emits the given event and invokes all handlers for it.
* `addEventListener(event, fn, context?, once?, priority?)` - Adds an event listener to the given event. Options are:
  * `context` - What `this` will refer to in your callback.
  * `once` - If this is true the event handler will once be invoked once.
  * `priority` - The priority of the event handler. See the numeric `Priority` enum for recommended base values.
* `on(event, fn, context?, priority?)` - Alias for `addEventListener(event, fn, false, context, priority)`.
* `once(event, fn, context?, priority?)` - Alias for `addEventListener(event, fn, true, context, priority)`.
* `removeListener(event, fn?: ListenerFn, context?, once?, priority?)` - Removes a event handler again.
* `off(event, fn?: ListenerFn, context?, once?, priority?)` - Alias for `removeListener` with the same parameters.
* `removeAllListeners(event?)` - Removes either all listeners of the entire emitter or just for the given event.

## Observer

The observer pattern is currently not part of the stable public API. Usage is therefore discouraged.

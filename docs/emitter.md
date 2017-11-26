# Emitter
Register and trigger pattern based "events".

## (constructor) `new Emitter([<Patternize> patternize])`
Creates an Emitter instance. A preconstructed instance of `Emitter` is provided in the module as `emitter`, it can be used across separate files as a single instance. The provided `emitter` is coupled with the also provided instance of `Patternize`; `patternize`.
```
const { Emitter } = require('@konfirm/patternize');
const emitter = new Emitter();

//  or, using the provided instance
const { emitter } = require('@konfirm/patternize');

//  or, create multiple emitters using the same Patternize instance
const { Patternize, Emitter } = require('@konfirm/patternize');
const patternize = new Patternize();
const emitterA = new Emitter(patternize);
const emitterB = new Emitter(patternize);
//  anything registered to emitterA is now also available in emitterB,
//  as these share the same Patternize instance
```

## `<void> on(<string> pattern, <Function> handle [, <number> limit=Infinity])`
Register a handler for a specific pattern, optionally limit the number of invocations.
The provided handler function will be called with the signature `<object> {input, values}` followed by the arguments provided to the `emit`. If the number of invocation reaches the configured limit, the handler is removed from the listeners.
```
const { emitter } = require('@konfirm/patternize');
emitter.on('foo.{bar}', (subject) => {
	console.log(subject.input);
});
```

## `<void> once(<string> pattern, <Function> handle)`
Register a handler for a specific pattern, to be invoked only once.
The provided handler function will be called with the signature `<object> {input, values}` followed by the arguments provided to the `emit`.
```
const { emitter } = require('@konfirm/patternize');
emitter.once('foo.{bar}', (subject) => {
	console.log(subject.input);
});
```

## `<array> off(<string> pattern, <Function> handle`
Remove all matching pattern/handle combinations and return the removed handlers as array.
```
const { emitter } = require('@konfirm/patternize');
const handle = (subject) => {
	console.log(subject.input);
};
emitter.on('foo.{bar}', handle);
const removed = emitter.off('foo.{bar}', handle);
console.log(removed);  //  <Function> handle
```

## `void emit(<string> input, ...args)`
Emit the string input to the registered handler for all matching patterns.
```
const { emitter } = require('@konfirm/patternize');
emitter.once('foo.{bar}', (subject, extra) => {
	console.log(subject, extra);
});

emitter.emit('foo.bar');
//  triggers the registered handler for 'foo.{bar}'
//  which then receives { input: 'foo.bar', values: { bar: 'bar' }}

emitter.emit('foo.qux', 'hello');
//  triggers the registered handler for 'foo.{bar}'
//  which then receives { input: 'foo.bar', values: { bar: 'qux' }}, 'hello'
```


# Documentation
 * [README](https://github.com/konfirm/node-patternize/blob/master/docs/README.md)
 * [`Patternize`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#patternize)
    * [`new Patternize()`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#constructor-new-patternize)
    * [`register(pattern [, force=false])`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#pattern-registerstring-pattern--bool-forcefalse)
    * [`match(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#array-matchstringobject-input)
    * [`matchOne(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#patternundefined-matchonestringobject-input)
    * [`find(pattern)`](https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#array-findpatternarraystring-pattern--bool-similarfalse)
 * [`Pattern`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#pattern)
    * [`fromString(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#static-pattern-fromstringstring-input)
    * [`createComponents(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#static-array-createcomponentsstring-input)
    * [`getComponentList(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#static-array-getcomponentlistpatternarraystring-input)
    * [`new Pattern(components)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#constructor-new-patternarray-components)
    * [`string`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#readonly-string-string)
    * [`normalized`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#readonly-string-normalized)
    * [`components`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#readonly-array-components)
    * [`matches(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#bool-matchesstring-input)
    * [`satisfies(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#bool-satisfiesobject-input)
    * [`getMatchedValues(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#map-getmatchedvaluesstring-input)
    * [`render(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#string-renderobject-input)
    * [`equals(compare)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#bool-equalspatternarraystring-compare)
    * [`same(compare)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#bool-samepatternarraystring-compare)
 * [`PatternComponent`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#patterncomponent)
    * [`new PatternComponent(input)`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#constructor-new-patterncomponentstring-input)
    * [`PROPERTY_PATTERN`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#static-readonly-regexp-property_pattern)
    * [`string`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#readonly-string-string)
    * [`key`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#readonly-string-key)
    * [`pattern`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#readonly-string-pattern)
    * [`regexp`](https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#readonly-regexp-regex)
 * [`Emitter`](https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#emitter)
    * [`new Emitter([patternize])`](https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#constructor-new-emitterpatternize-patternize)
    * [`on(pattern, handle [,limit=Infinity])`](https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#void-onstring-pattern-function-handle--number-limitinfinity)
    * [`once(pattern, handle)`](https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#void-oncestring-pattern-function-handle)
    * [`emit(input, ...args)`](https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#void-emitstring-input-args)

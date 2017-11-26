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
The provided handler function will be called with the signature `<object> {input, values}` followed by the arguments provided to the `emit`.
```
const { emitter } = require('@konfirm/patternize');
emitter.on('foo.{bar}', (subject) => {
	console.log(subject.input);
});
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
 * [README](../README.md)
 * [`Patternize`](patternize.md#patternize)
    * [`new Patternize()`](patternize.md#constructornewpatternize)
    * [`register(pattern [, force=false])`](patternize.md#patternregisterstringpatternboolforcefalse)
    * [`match(input)`](patternize.md#arraymatchstringobjectinput)
    * [`matchOne(input)`](patternize.md#patternundefinedmatchonestringobjectinput)
    * [`find(pattern)`](patternize.md#arrayfindpatternarraystringpatternboolsimilarfalse)
 * [`Pattern`](pattern.md#pattern)
    * [`fromString(input)`](pattern.md#staticpatternfromstringstringinput)
    * [`createComponents(input)`](pattern.md#staticarraycreatecomponentsstringinput)
    * [`getComponentList(input)`](pattern.md#staticarraygetcomponentlistpatternarraystringinput)
    * [`new Pattern(components)`](pattern.md#constructornewpatternarraycomponents)
    * [`string`](pattern.md#readonlystringstring)
    * [`normalized`](pattern.md#readonlystringnormalized)
    * [`components`](pattern.md#readonlyarraycomponents)
    * [`matches(input)`](pattern.md#boolmatchesstringinput)
    * [`satisfies(input)`](pattern.md#boolsatisfiesobjectinput)
    * [`getMatchedValues(input)`](pattern.md#mapgetmatchedvaluesstringinput)
    * [`render(input)`](pattern.md#stringrenderobjectinput)
    * [`equals(compare)`](pattern.md#boolequalspatternarraystringcompare)
    * [`same(compare)`](pattern.md#boolsamepatternarraystringcompare)
 * [`PatternComponent`](pattern-component.md#patterncomponent)
    * [`new PatternComponent(input)`](pattern-component.md#constructornewpatterncomponentstringinput)
    * [`PROPERTY_PATTERN`](pattern-component.md#staticreadonlyregexppropertypattern)
    * [`string`](pattern-component.md#readonlystringstring)
    * [`key`](pattern-component.md#readonlystringkey)
    * [`pattern`](pattern-component.md#readonlystringpattern)
    * [`regexp`](pattern-component.md#readonlyregexpregex)
 * [`Emitter`](emitter.md#emitter)
    * [`new Emitter([patternize])`](emitter.md#constructornewemitterpatternizepatternize)
    * [`on(pattern, handle [,limit=Infinity])`](emitter.md#voidonstringpatternfunctionhandlenumberlimitinfinity)
    * [`once(pattern, handle)`](emitter.md#voidoncestringpatternfunctionhandle)
    * [`emit(input, ...args)`](emitter.md#voidemitstringinputargs)

# Patternize Module

Register and match patterns. Use patterns as EventEmitter subjects.

## Getting started

### Installation

```
$ npm install --save @konfirm/patternize
```

### Usage

#### Matching patterns

```
const { patternize } = require('@konfirm/patternize');

patternize.register('hello.{audience}');

const input = 'hello.world';
const match = patternize.match(input);

//  match is now a list of matched Patterns, which can be explored even further
console.log(match[0].getMatchedValues(input));  //  { audience: 'world' }
```

#### Pattern events

```
const { emitter } = require('@konfirm/patternize');

emitter.on('hello.{audience}', (subject) => {
	console.log(subject.input);   //  'hello.world'
	console.log(subject.values);  //  { audience: 'world' }
});

emiter.emit('hello.world');
```

## API

The main package file is an export of several classes and ready to use instances. These can be easily accessed using [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
For example;

```
//  All exported instances
const { patternize, emitter } = require('@konfirm/patternize');

//  All exported classes
const { Patternize, Pattern, PatternComponent, Emitter } = require('@konfirm/patternize');
```

### Available exports
 type       | name                                            | description
------------|-------------------------------------------------|-------------
 `class`    | [`Patternize`https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#patternize)   | The [`Patternize`https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#patternize) class
 `class`    | [`Pattern`https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#pattern)            | The [`Pattern`https://github.com/konfirm/node-patternize/blob/master/docs/pattern.md#pattern) class
 `class`    | [`PatternComponent`https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md) | The [`PatternComponent`https://github.com/konfirm/node-patternize/blob/master/docs/pattern-component.md#patterncomponent) class
 `class`    | [`Emitter`https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#emitter)            | The [`Emitter`https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#emitter) class
 `instance` | `patternize`                                    | Ready to use instance of [`Patternize`https://github.com/konfirm/node-patternize/blob/master/docs/patternize.md#patternize)
 `instance` | `emitter`                                       | Ready to use instance of [`Emitter`https://github.com/konfirm/node-patternize/blob/master/docs/emitter.md#emitter), linked with the `patternize` instance

## Documentation
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

## Licence

MIT License

Copyright (c) 2017 Konfirm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

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
 type       | name                                           | description
------------|------------------------------------------------|-------------
 `class`    | [`Patternize`](docs/patternize.md)             | The [`Patternize`](docs/patternize.md) class
 `class`    | [`Pattern`](docs/pattern.md)                   | The [`Pattern`](docs/pattern.md) class
 `class`    | [`PatternComponent`](docs/pattern-component.md) | The [`PatternComponent`](docs/pattern-component.md#patterncomponent) class
 `class`    | [`Emitter`](docs/emitter.md#emitter)                   | The [`Emitter`](docs/emitter.md#emitter) class
 `instance` | `patternize`                                   | Ready to use instance of [`Patternize`](docs/patternize.md#patternize)
 `instance` | `emitter`                                      | Ready to use instance of [`Emitter`](docs/emitter.md#emitter), linked with the `patternize` instance


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

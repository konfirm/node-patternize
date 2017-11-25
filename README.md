# Patternize

Register and Match patterns. Use patterns as EventEmitter subjects.

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
const { Patternize, Pattern, Emitter } = require('@konfirm/patternize');
```

### Available exports
 type       | name                                    | description
------------|-----------------------------------------|-------------
 `class`    | [`Patternize`](#Patternize)             | The [`Patternize`](#Patternize) class
 `class`    | [`Pattern`](#Pattern)                   | The [`Pattern`](#Pattern) class
 `class`    | [`PatternComponent`](#PatternComponent) | The [`PatternComponent`](#PatternComponent) class
 `class`    | [`Emitter`](#Emitter)                   | The [`Emitter`](#Emitter) class
 `instance` | `patternize`                            | Ready to use instance of [`Patternize`](#Patternize)
 `instance` | `emitter`                               | Ready to use instance of [`Emitter`](#Emitter), linked with the `patternize` instance


### Patternize

### Pattern
Configure a pattern handler

#### (static) `fromString(String input)`
Creates a new Pattern instance from string input
```
const pattern = Pattern.fromString('hello.{audience}`);
```

#### (static) `createComponents(String input)`
Create components from the input string.
```
const components = Pattern.createComponents('hello.{audience}');
```

#### (static) `getComponentList(Pattern|Array|String input)`
Obtain the components from either a Pattern instance, an array of components or a pattern string
```
const components = Pattern.getComponentList(pattern);  //  pattern is a Pattern instance
```

#### (constructor) `new Pattern(array components)`
Construct a new Pattern instance from an array of (Pattern)Component instances.
Refer to the [PatternComponent](#PatternComponent) documentation on how to create those or stick with the static [`fromString`](#staticfromstringstringinput) method.
```
const pattern = new Pattern([new PatternComponent(...)]);
```

#### (readonly) `string`
The string used to create the Pattern instance
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.string);  //  'hello.{audience}'
```

#### (readonly) `normalized`
The normalized version of the Pattern string, unifying all variable components to `{*}` so they can be ordered properly.
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.normalized);  //  'hello.{*}'
```

#### (readonly) `components`
All components provided during construction

#### `<bool> matches(string input)`
Test whether the pattern matches the input string.
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.matches('hello.world');     //  true
console.log(pattern.matches('hello.universe');  //  true
console.log(pattern.matches('hi.universe');     //  false
```

#### `<bool> satisfies(object input)`
Test whether the provided object satisfies all variables present in the Pattern
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.satisfies({ target: 'world' }));    //  false (no 'audience'-key)
console.log(pattern.satisfies({ audience: 'world' }));  //  true
console.log(pattern.satisfies({ audience: 'world', other: 'stuff' }));  //  true ('audience'-key is present)
```

#### `<Map> getMatchedValues(string input)`
Obtain a Map containing all the variables present in the Pattern based on the matched values
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.getMatchedValues('hello.world'));  //  { audience: 'world' }
console.log(pattern.getMatchedValues('hi.world'));     //  { }
```

#### `<string> render(object input)`
Obtain the string representation of the Pattern using the variables form the input object
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.render({ audience: 'world' }));     //  'hello.world'
console.log(pattern.render({ audience: 'universe' }));  //  'hello.universe'
console.log(pattern.render({ target: 'universe' }));    //  'hello.' (audience is not present)
```

#### `<bool> equals(Pattern|Array|String compare)`
Test whether the given Pattern, Array (of components) or String has the exact same string representation as the current Pattern
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.equals('hello.audience));    //  false
console.log(pattern.equals('hello.{audience}));  //  true
console.log(pattern.equals('hello.{target}));    //  false
```
#### `<bool> same(Pattern|Array|String compare)`
Test whether the given Pattern, Array (of components) or String has would match the same input
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.equals('hello.audience));    //  false
console.log(pattern.equals('hello.{audience}));  //  true
console.log(pattern.equals('hello.{target}));    //  true
```

### PatternComponent
A single matchable component of a Pattern.

#### (constructor) `new PatternComponent(string input)`
Creates an instance of PatternComponent.
```
const component = new PatternComponent('hello');
```

#### (static, readonly) `PROPERTY_PATTERN`
The regular expression used to determine what a variable looks like and (optionally) the expression to use to determine which values would match the input.
The expression uses the following structure:
- a variable must start with a letter (any case), followed by zero or more letters, numbers or underscores
- optionally followed by a colon with a after that pattern (regular expression)
- if no custom expression is specified, `\w+` is used (matching any combination of letters, numbers and underscores)

 input         | matches | key name | pattern         | example
---------------|---------|----------|-----------------|---------
`'{key}'`      | yes     | key      | (default `\w+`) | `'hello'`
`'{1234}'`     | no      | |
`'{foo:\\d+}'` | yes     | foo      | `\d+`           | `'1234567'`

#### (readonly) `string`
Obtain the string literal used to create the component
```
const component = new PatternComponent('foo');

console.log(component.string);  //  'foo'
```

#### (readonly) `key`
Obtain the key configured for the component (if any)
```
const component = new PatternComponent('{foo}');

console.log(component.key);  //  'foo'
```

#### (readonly) pattern
Obtain the pattern configured for the component, used to match the component
```
const component = new PatternComponent('foo.bar.baz');

console.log(component.pattern);  //  'foo\.bar\.baz'
```

#### (readonly) regex
Obtain the regular expression (`RegExp`) configured for the component
```
const component = new PatternComponent('foo.bar.baz');

console.log(component.regex);  //  '/foo\.bar\.baz/`
```


### Emitter


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

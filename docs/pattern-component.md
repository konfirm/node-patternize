# PatternComponent
A single matchable component of a Pattern.

## (constructor) `new PatternComponent(<string> input)`
Creates an instance of PatternComponent.
```
const component = new PatternComponent('hello');
```

## (static, readonly) `<RegExp> PROPERTY_PATTERN`
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

## (readonly) `<string> string`
Obtain the string literal used to create the component
```
const component = new PatternComponent('foo');

console.log(component.string);  //  'foo'
```

## (readonly) `<string> key`
Obtain the key configured for the component (if any)
```
const component = new PatternComponent('{foo}');

console.log(component.key);  //  'foo'
```

## (readonly) `<string> pattern`
Obtain the pattern configured for the component, used to match the component
```
const component = new PatternComponent('foo.bar.baz');

console.log(component.pattern);  //  'foo\.bar\.baz'
```

## (readonly) `<RegExp> regex`
Obtain the regular expression (`RegExp`) configured for the component
```
const component = new PatternComponent('foo.bar.baz');

console.log(component.regex);  //  '/foo\.bar\.baz/`
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

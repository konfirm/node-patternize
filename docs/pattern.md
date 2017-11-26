# Pattern
Configure a pattern handler

## (static) `<Pattern> fromString(<string> input)`
Creates a new Pattern instance from string input
```
const pattern = Pattern.fromString('hello.{audience}`);
```

## (static) `<array> createComponents(<string> input)`
Create components from the input string.
```
const components = Pattern.createComponents('hello.{audience}');
```

## (static) `<array> getComponentList(<Pattern|array|string> input)`
Obtain the components from either a Pattern instance, an array of components or a pattern string
```
const components = Pattern.getComponentList(pattern);  //  pattern is a Pattern instance
```

## (constructor) `new Pattern(<array> components)`
Creates a new Pattern instance from an array of (Pattern)Component instances.
Refer to the [PatternComponent](#patternComponent) documentation on how to create those or stick with the static [`fromString`](#staticfromstringstringinput) method.
```
const { Pattern, PatternComponent } = require('@konfirm/patternize');
const pattern = new Pattern([new PatternComponent(...)]);
```

## (readonly) `<string> string`
The string used to create the Pattern instance
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.string);  //  'hello.{audience}'
```

## (readonly) `<string> normalized`
The normalized version of the Pattern string, unifying all variable components to `{*}` so they can be ordered properly.
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.normalized);  //  'hello.{*}'
```

## (readonly) `<array> components`
All components provided during construction

## `<bool> matches(<string> input)`
Test whether the pattern matches the input string.
```
const pattern = Pattern.fromString('hello.{audience}`);

console.log(pattern.matches('hello.world');     //  true
console.log(pattern.matches('hello.universe');  //  true
console.log(pattern.matches('hi.universe');     //  false
```

## `<bool> satisfies(<object> input)`
Test whether the provided object satisfies all variables present in the Pattern
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.satisfies({ target: 'world' }));    //  false (no 'audience'-key)
console.log(pattern.satisfies({ audience: 'world' }));  //  true
console.log(pattern.satisfies({ audience: 'world', other: 'stuff' }));  //  true ('audience'-key is present)
```

## `<Map> getMatchedValues(<string> input)`
Obtain a Map containing all the variables present in the Pattern based on the matched values
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.getMatchedValues('hello.world'));  //  { audience: 'world' }
console.log(pattern.getMatchedValues('hi.world'));     //  { }
```

## `<string> render(<object> input)`
Obtain the string representation of the Pattern using the variables form the input object
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.render({ audience: 'world' }));     //  'hello.world'
console.log(pattern.render({ audience: 'universe' }));  //  'hello.universe'
console.log(pattern.render({ target: 'universe' }));    //  'hello.' (audience is not present)
```

## `<bool> equals(<Pattern|array|string> compare)`
Test whether the given Pattern, Array (of components) or String has the exact same string representation as the current Pattern
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.equals('hello.audience));    //  false
console.log(pattern.equals('hello.{audience}));  //  true
console.log(pattern.equals('hello.{target}));    //  false
```
## `<bool> same(<Pattern|array|string> compare)`
Test whether the given Pattern, Array (of components) or String has would match the same input
```
const pattern = Pattern.fromString('hello.{audience}');

console.log(pattern.equals('hello.audience));    //  false
console.log(pattern.equals('hello.{audience}));  //  true
console.log(pattern.equals('hello.{target}));    //  true
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

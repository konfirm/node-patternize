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

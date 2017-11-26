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

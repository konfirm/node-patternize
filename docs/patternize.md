# Patternize
The main pattern registry. It registers, matches and finds patterns.

## (constructor) `new Patternize()`
Creates an instance of Patternize. A preconstructed instance of `Patternize` is provided in the module as `patternize`, it can be used across separate files as a single instance.
```
const { Patternize } = require('@konfirm/patternize');
const patternize = new Patternize();

// or, using the provided instance
const { patternize } = require('@konfirm/patternize');
```

## `<Pattern> register(<string> pattern [, <bool> force=false])`
Register a pattern for matching. If the exact same pattern already exists the existing one will be returned an no new one is added (unless forced)
```
const { patternize } = require('@konfirm/patternize');
const pattern = patternize.register('foo.{bar}');
```

## `<array> match(<string|object> input)`
Match the input to obtain a list of matching patterns.
The matching patterns will be ordered in order of greedyness, giving precedence to the more specific ones.
```
const { patternize } = require('@konfirm/patternize');

patternize.register('foo.{bar}');
patternize.register('foo.bar');

const match = patternize.match('foo.bar');
console.log(match);  //  [ <Pattern> 'foo.bar', <Pattern> 'foo.{bar}' ]
```

## `<Pattern|undefined> matchOne(<string|object> input)`
Match the input to obtain the top matching pattern, if any.
```
const { patternize } = require('@konfirm/patternize');

patternize.register('foo.{bar}');
patternize.register('foo.bar');

const matchOne = patternize.matchOne('foo.bar');
console.log(matchOne);  //  <Pattern> 'foo.bar'
```

## `<array> find(<Pattern|array|string> pattern [, <bool> similar=false])`
Find patterns matching the provided pattern structure. It will search for the exact pattern, unless `similar` is set to `true`(-ish), then it will provide similar (e.g. the key name specified in the pattern is different but will match the same inputs).
```
const { patternize } = require('@konfirm/patternize');

patternize.register('foo.{bar}');
patternize.register('foo.{example}');
patternize.register('foo.bar');

const exact = patternize.find('foo.{bar}');
console.log(exact);  //  [ <Pattern> 'foo.{bar}' ]

const similar  = patternize.find('foo.{bar}', true);
console.log(similar);  //  [ <Pattern> 'foo.{bar}', <Pattern> 'foo.{example}' ]
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

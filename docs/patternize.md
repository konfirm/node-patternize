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

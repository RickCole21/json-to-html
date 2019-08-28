# json-to-html
a small tool convert json to html template

# Install
```
npm i @rickcole/json-to-html
```

# Usage
convert json object, array, string into html template:
```
import jsonToHtml from '@rickcole/json-to-html';

let schema = {
    tag: 'div',
    children: [
        {
            tag: 'div',
            class: 'inner-div',
            children: [
                {
                    tag: 'p',
                    children: 'this is a paragraph'
                },
                {
                    tag: 'h1',
                    children: 'this is a header'
                },
            ]
        },
        'a simple string',
        {
            tag: 'span',
            children: 'this is a span'
        }
    ]
};

jsonToHtml(schema);
```
result :
```
<div>
    <div class="inner-div">
        <p>this is a paragraph</p>
        <h1>this is a header</h1>
    </div>
    a simple string
    <span>this is a span</span>
</div>
```

# Config
you can use config to change the output:
```
jsonToHtml(schema, {
    indent: 4,
    wrap: true,
    raw: false
});
```
| name        | type    | default value | description                                        |
| ----------- | ------- | ------------- | -------------------------------------------------- |
| indent      | number  | 4             | indent                                             |
| wrap        | boolean | true          | whether wrap the content or not                    |
| raw         | boolean | false         | escacpe the content.(e.g.,`<` to `&lt;`)           |
| tagKey      | string  | 'tag'         | you can change your `tag key` by setting this      |
| childrenKey | string  | 'children'    | you can change your `children key` by setting this |

# Q&A

## 1. use different key to get tag or children
```
const schema = {
    type: 'div',
    items: [
        {
            type: 'span',
            items: [
                {
                    type: 'span',
                    items: 'a'
                }
            ]
        },
    ]
};

jsonToHtml(schema, {
    tagKey: 'type',
    children: 'items'
});
```

## 2. tag or children key is conflict with your attribute key
```
{
    tag: 'component',
    class: 'a-div',
    extraAttrs: { // set this only if necessary
        tag: 'sometag', // conflict with 'tag' key
        children: 'somechildren' // conflict with 'children' key
    },
}
```
result:
```
<component class="a-div" tag="sometag" children="somechildren"></component>
```

## 3. set true attribute value
```
{
    tag: 'component',
    disabled: true,
    'is-active': false // omit
}
```
result:
```
<component disabled></component>
```

> value equals: `''`, `null`, `undefined`, `NaN`, `false`. will be omitted.

## 4. attribute value contains `"`
```
{
    tag: 'component',
    'on-click': 'onClick("foo")' // it's ok
}
```
result:

```
// onClick("foo") ==> onClick('foo')
<component on-click="onClick('foo')"></component>
```
btw, it works as well:
```
{
    tag: 'component',
    'on-click': 'onClick(\'foo\')'
}
```

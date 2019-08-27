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
| name   | type    | default value | description                                   |
| ------ | ------- | ------------- | --------------------------------------------- |
| indent | number  | 4             | indent                                        |
| wrap   | boolean | true          | whether wrap the content or not               |
| raw    | boolean | false         | escacpe the content.(e.g.,`<` to `&lt;`)      |
| tagKey | string | 'tag'         | you can change your `tag key` by setting this |

# Q&A

## 2. How to change tag key
```
const schema = {
    rick: 'div',
    children: [
        {
            rick: 'span',
            children: [
                {
                    rick: 'span',
                    children: 'a'
                }
            ]
        },
    ]
};

jsonToHtml(schema, {
    tagKey: 'rick'
});
```

## 2. What If I What Set Attributes Like `<component tag="sometag"></component>` or `<component children="somechildren"></component>`?
```
{
    tag: 'component',
    class: 'a-div',
    extraAttrs: { // set this key only if necessary
        tag: 'sometag',
        children: 'somechildren'
    },
}

// result
<component class="a-div" tag="sometag" children="somechildren"></component>
```
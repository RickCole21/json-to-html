# json-to-html
a small tool convert json to html template

# Install
```
npm i @rickcole/json-to-html
```

# Usage
convert json object, array into html template:
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
| name   | type    | default value | description                              |
| ------ | ------- | ------------- | ---------------------------------------- |
| indent | number  | 4             | indent                                   |
| wrap   | boolean | true          | whether wrap the content or not          |
| raw    | boolean | false         | escacpe the content.(e.g.,`<` to `&lt;`) |

import jsonToHtml from '../src/index';
import './style.scss';

const schema1 = {
    tag: 'div',
    children: [
        {
            tag: 'div',
            class: 'innerDiv1',
            'on-click': 'onClick(\'a\')',
            children: [
                {
                    tag: 'p',
                    children: 'pppppp'
                },
                {
                    tag: 'h1',
                    children: 'h1h1h1h1'
                },

            ]
        },
        {
            tag: 'input',
            name: 'input',
            value: '1',
            disabled: true
        },
        null,
        '纯字符串',
        {
            tag: 'div',
            class: 'innerDiv2',
            extraAttrs: {
                tag: 'sometag',
                children: 'somechildren'
            },
            children: [
                {
                    tag: 'span',
                    children: [
                        {
                            tag: 'span',
                            children: 'a'
                        }
                    ]
                },
                {
                    tag: 'h1',
                    children: 'h1h1h1h1'
                },
            ]
        },
        {
            tag: 'span',
            children: '这是span1'
        },
        {
            tag: 'span',
            children: '这是span2'
        },
    ]
};

const app = document.createElement('div');
app.className = 'app';
document.body.appendChild(app);

let config = {
    raw: true,
    wrap: true,
    tagField: 'tag'
};

// code
let pre = document.createElement('pre');
pre.className = 'code';
pre.innerHTML = jsonToHtml(schema1, {
    ...config,
    raw: true
});

// preview
let preview = document.createElement('div');
preview.className = 'preview';
preview.innerHTML = jsonToHtml(schema1, {
    ...config,
    raw: false
});

(document.querySelector('.app') as Element).appendChild(pre);
(document.querySelector('.app') as Element).appendChild(preview);

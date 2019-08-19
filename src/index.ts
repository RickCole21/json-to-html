interface SchemaNode {
    tag: string;
    children?: Array<SchemaNode> | string | number;
    [propName: string]: any;
}

interface Config {
    raw?: boolean; // 显示转义字符
    wrap?: boolean; // 是否换行显示
    indent?: number; // 缩进，最大支持到8
    htmlOnly?: boolean; // 是否只允许html标签
}

const defaultConfig: Config = {
    raw: false,
    wrap: true,
    indent: 4,
    htmlOnly: true
};

const allowedTags: Array<string> = [

];

/**
 * object --> value="value" name="name"
 * @param {e} schema
 */
function resolveAttrs(attrsObject: any) {

    if (typeof attrsObject === 'object' && JSON.stringify(attrsObject) === '{}') {
        return '';
    }

    return ' ' + Object.keys(attrsObject).map(key => `${key}="${attrsObject[key]}"`).join(' ');
}

function jsonToHtml(schema: SchemaNode | Array<SchemaNode>, config?: Config, depth: number = 0): string {

    if (Array.isArray(schema)) {
        return schema.map(childSchema => jsonToHtml(childSchema, config, depth)).join('');
    }

    let {tag, children, ...rest} = schema;
    let {raw, wrap, indent, htmlOnly} = Object.assign(defaultConfig, config);

    let indentToken = wrap ? ' '.repeat(depth * Math.min(indent as number, 8)) : '';
    let wrapToken = wrap ? '\n' : ''

    // if (htmlOnly && !~allowedTags.indexOf(tag)) {
    //     console.error('当前标签不符合标准html');
    //     return '';
    // }

    // let leftTag = `${indentToken}<${tag}${attrs} data-depth="${depth}">`;
    let leftTag = `${indentToken}<${tag}${resolveAttrs(rest)}>`;
    let rightTag = `</${tag}>${wrapToken}`;

    let content: string | number = '';
    if (
        (typeof children === 'string' && !/<.+>.+<\/[a-z0-9]+>/.test(content))
        || typeof children === 'number'
    ) {
        content = children;
    } else {
        if (/<.+>.+<\/[a-z0-9]+>/.test(content)) { // 如果是标签，则需要加缩进和换行
            content = indentToken + indentToken + children + wrapToken;
        } else if (typeof children === 'object') {
            content = jsonToHtml(children, config, depth + 1);
        } else if (Array.isArray(children)) {
            content = children.map((child: SchemaNode) => jsonToHtml(child, config, depth + 1)).join('');
        }

        leftTag = leftTag + wrapToken;
        rightTag = indentToken + rightTag;
    }

    let result = leftTag + content + rightTag;

    if (raw) {
        result = result.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
    }

    return result;
}

export default jsonToHtml;
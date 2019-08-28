interface SchemaNode {
    tag: string;
    children?: Array<SchemaNode> | string | number;
    extraAttrs?: object; // 有时候如果需要添加和tag或者children相同的属性时，在这里添加，否则不要设定这个值
    [propName: string]: any;
}

interface Config {
    raw?: boolean; // 显示转义字符
    wrap?: boolean; // 是否换行显示
    indent?: number; // 缩进，最大支持到8
    htmlOnly?: boolean; // 是否只允许html标签
    tagKey?: string; // 获取 tag 的字段
    childrenKey?: string; // 获取 children 的字段
}

const defaultConfig: Config = {
    raw: false,
    wrap: true,
    indent: 4,
    htmlOnly: true
};

const allowedTags: Array<string> = [
    // todo
];

/**
 * object --> value="value" name="name"
 *
 * @param attrsObject
 * @param extraAttrsObject
 */
function resolveAttrs(attrsObject: any, extraAttrsObject?: object) {

    let attrs = Object.assign(attrsObject, extraAttrsObject);

    if (typeof attrs === 'object' && JSON.stringify(attrs) === '{}') {
        return '';
    }

    let attrStrings = Object.keys(attrsObject).map(attrKey => {
        let attrValue = attrsObject[attrKey];

        // deal: <com disabled></com>
        if (attrValue === true) {
            return attrKey;
        }

        // deal: '', undefined, null, NaN, false，则不显示该attr
        if (!attrValue && attrValue !== 0) {
            return '';
        }

        // deal: <tag on-click="onClick("xx")"></tag>
        if (typeof attrValue === 'string' && ~attrValue.indexOf('"')) {
            attrValue = attrValue.replace(/"/g, '\'');
        }

        return `${attrKey}="${attrValue}"`;
    }).filter(i => !!i);

    return ' ' + attrStrings.join(' ');
}

function jsonToHtml(schema: SchemaNode | Array<SchemaNode> | string | number, config?: Config, depth: number = 0): string {

    if (Array.isArray(schema)) {
        return schema.map(childSchema => jsonToHtml(childSchema, config, depth)).join('');
    }

    let {
        raw,
        wrap,
        indent,
        htmlOnly,
        tagKey,
        childrenKey
    } = Object.assign(defaultConfig, config);

    let indentToken = wrap ? ' '.repeat(depth * Math.min(indent as number, 8)) : '';
    let wrapToken = wrap ? '\n' : ''

    if (typeof schema === 'string' || typeof schema === 'number') {
        return indentToken + schema + wrapToken;
    }

    let {
        [tagKey || 'tag']: tag,
        [childrenKey || 'children']: children,
        extraAttrs,
        ...rest
    } = schema;
    // let tag = schema[];

    // if (htmlOnly && !~allowedTags.indexOf(tag)) {
    //     console.error('当前标签不符合标准html');
    //     return '';
    // }

    // let leftTag = `${indentToken}<${tag}${attrs} data-depth="${depth}">`;
    let leftTag = `${indentToken}<${tag}${resolveAttrs(rest, extraAttrs)}>`;
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
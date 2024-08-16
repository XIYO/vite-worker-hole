import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';
import rehypteMermaid from 'rehype-mermaid';
import gitLog from './gitLog.js';
import rehypeCallouts from 'rehype-callouts'
import { resolve, join } from 'path';

/**
 * @type {import('rehype-mermaid').RehypeMermaidOptions}
 * mermaidConfig https://mermaid.js.org/config/theming.html
 */
const rehypeMermaidOptions = {
    mermaidConfig: {
        theme: 'dark',
        fontFamily: 'inherit'
    }
};

/**
 * @type {import('@shikijs/rehype').RehypeShikiOptions}
 */
const rehypeShikiOptions = {
    theme: 'dracula'
};

export default async function({data, key}) {
    // const filePath = join(process.cwd(), key);

    return unified()
        // .use(gitLog, { filePath })

        // remark
        .use(remarkParse)

        // rehype
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeCallouts)
        .use(rehypteMermaid, rehypeMermaidOptions)
        .use(rehypeShiki, rehypeShikiOptions)

        // rehype stringify
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(data);
}

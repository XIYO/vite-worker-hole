import {describe, it} from 'vitest';
import {Worker} from "worker_threads";
import markdown from "../../src/markdown.js";
import {cpus} from "node:os";
import gitLog from "../../src/gitLog.js";
import {join} from "path";

const maxConcurrency = cpus().length;
const taskQueue = [];
let activeWorkers = 0;

function markdownPromise({key, data}) {
    return new Promise((resolve, reject) => {
        taskQueue.push({ data, key, resolve, reject });
        processQueue();
    });
}

async function processQueue() {
    while (taskQueue.length > 0 && activeWorkers < maxConcurrency) {
        const { key, data, resolve, reject } = taskQueue.shift();

        const markdown = await data();

        const worker = new Worker('./src/workerMarkdown.js', { workerData: { data: markdown, key } });
        activeWorkers++;

        worker.on('message', (result) => {
            resolve(result);
            activeWorkers--;
            processQueue();
        });
    }
}

describe('Fibonacci Worker', () => {
    it('마크다운 파싱', async  () => {
       performance.mark('start');

        const promises = [];
        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw', import: 'default', eager: true
        });

        Object.entries(markdowns).forEach(([key, data]) => {
            promises.push(markdown({data, key}));
        });

        const html = await Promise.all(promises);

        performance.mark('end');
        performance.measure('Markdown Worker', 'start', 'end');
        console.log(performance.getEntriesByName('Markdown Worker'));
    }, 0);

    it('워커 마크다운 파싱, 더 느림. 오버헤드? Git log disk io?', async () => {
        performance.mark('start');

        const promises = [];
        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw', import: 'default'
        });

        Object.entries(markdowns).forEach(([key, data]) => {
            const htmlPromise = markdownPromise({data, key});
            promises.push(htmlPromise);
        });

        const html = await Promise.all(promises);

        performance.mark('end');
        performance.measure('Markdown Worker', 'start', 'end');
        console.log(performance.getEntriesByName('Markdown Worker'));
    }, 0);

    it('깃 로그만 추출', async () => {
        performance.mark('start');

        const promises = [];
        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw', import: 'default'
        });

        Object.entries(markdowns).forEach(([key, data]) => {
            const filePath = join(process.cwd(), key);

            const htmlPromise = gitLog({filePath});
            promises.push(htmlPromise);
        });

        const gitLogs = await Promise.all(promises);

        performance.mark('end');
        performance.measure('Markdown Worker', 'start', 'end');
        console.log(performance.getEntriesByName('Markdown Worker'));
    })

    it('워커 깃 로그만 추출', async () => {
      performance.mark('start');

        const promises = [];
        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw'
        });

        Object.entries(markdowns).forEach(([key, data]) => {
            //
        });

        const gitLogs = await Promise.all(promises);

        performance.mark('end');
        performance.measure('Markdown Worker', 'start', 'end');
        console.log(performance.getEntriesByName('Markdown'));
    })
});

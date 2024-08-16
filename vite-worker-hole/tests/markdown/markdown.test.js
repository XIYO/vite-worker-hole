import {describe, it} from 'vitest';
import {Worker} from "worker_threads";
import markdown from "../../src/markdown.js";

function markdownPromise(markdown) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/workerMarkdown.js', {
            workerData: markdown,
        });

        worker.on('message', resolve);  // 워커에서 전달된 메시지를 resolve
        worker.on('error', reject);  // 워커 에러 시 reject
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
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
    });

    it('워커 마크다운 파싱', async () => {
        performance.mark('start');

        const promises = [];
        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw', import: 'default', eager: true
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
});

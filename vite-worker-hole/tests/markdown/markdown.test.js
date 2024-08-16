import {describe, it} from 'vitest';
import {Worker} from "worker_threads";
import markdown from "../../src/markdown.js";
import {cpus} from "node:os";
import gitLog from "../../src/gitLog.js";
import {join} from "path";



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

        const markdowns = import.meta.glob('/posts/**/*.md', {
            query: '?raw', import: 'default', eager: true
        });

        const tasks =    Object.entries(markdowns).map(([key, data]) => {
            return {key, data};
        })

        // const maxConcurrency = cpus().length; // CPU 코어 수만큼 워커 생성
        const maxConcurrency = 1;
        const workerPool = [];

        // CPU 코어 수만큼 워커를 생성하고 풀에 추가
        for (let i = 0; i < maxConcurrency; i++) {
            const worker = new Worker('./src/workerMarkdown.js'); // 워커 스크립트를 지정

            const promise = new Promise((resolve, reject) => {
                worker.on('message', (e) => {
                    console.log(e);
                    if (tasks.length > 0) {
                        worker.postMessage(tasks.pop());
                    } else {
                        resolve();
                        worker.terminate();
                    }
                })
            });

            workerPool.push(promise);

            worker.postMessage(tasks.pop());
        }

        const data = await Promise.all(workerPool);
        console.log(data);

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

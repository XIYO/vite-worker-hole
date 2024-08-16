import {describe, it} from 'vitest';
import {Worker} from "worker_threads";
import {cpus} from "node:os";

describe('슬로우 모듈 테스트', () => {
    it('슬로우 모듈 10번 실행', async (done) => {
        const slowLib = await import('../../src/slow-lib/slowLib.js');

        for (let i = 0; i < 100; i++) {
            console.log(await slowLib.default({
                delayTime: 100
            }));
        }
    }, 0);

    it('슬로우 모듈 워커로 100번 실행', async () => {
        const maxConcurrency = cpus().length; // CPU 코어 수만큼 워커 생성
        const workerPool = [];
        let tasks = 100; // 총 작업 수

        // CPU 코어 수만큼 워커를 생성하고 풀에 추가
        for (let i = 0; i < maxConcurrency; i++) {
            const worker = new Worker('./src/slow-lib/workerSlowLib.js'); // 워커 스크립트를 지정

            const promise = new Promise((resolve, reject) => {
                worker.on('message', (e) => {
                    console.log(e);
                    if (tasks > 0) {
                        worker.postMessage(tasks--);
                    } else {
                        resolve();
                        worker.terminate();
                    }
                })
            });

            workerPool.push(promise);

            worker.postMessage(tasks--);
        }

        const data = await Promise.all(workerPool);
        console.log(data);
    }, 0);
});

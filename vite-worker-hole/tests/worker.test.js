import { describe, it, expect } from 'vitest';
import { Worker } from 'worker_threads';
import fibonacci from "../src/fibonacci.js";
import {cpus} from "node:os";

function fibonacciWorker(n) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/worker.js', {
            workerData: n,
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });

        worker.postMessage(n);
    });
}

describe('Fibonacci Worker', () => {
    const n = 42; // 피보나치를 계산할 값 (40 ~ 44 사이 추천, 45 이상은 오래 걸림)
    const count = cpus().length; // CPU 코어만큼 반복

    it('단순 피보나치 계산', () => {
        performance.mark('start');

        for(let i = 0; i < count; i++) {
            fibonacci(n); // 메인 스레드에서 직접 피보나치를 계산
        }

        performance.mark('end');

        performance.measure('Fibonacci Main Thread', 'start', 'end');
        console.log(performance.getEntriesByName('Fibonacci Main Thread'));
    });

    it('비동기 피보나치 게산, 성능 향상 없음', async () => {
        performance.mark('start');

        const promises = [];
        for(let i = 0; i < count; i++) {
            promises.push(new Promise((resolve) => {
                    fibonacci(n)
                    resolve()
                })
            );
        }

        await Promise.all(promises);

        performance.mark('end');

        performance.measure('Fibonacci Main Thread', 'start', 'end');
        console.log(performance.getEntriesByName('Fibonacci Main Thread'));
    })

    it('워커를 사용한 피보나치 계산, 확실한 성능 향상', async () => {
        performance.mark('start');

        const promises = [];
        for(let i = 0; i < count; i++) {
            promises.push(fibonacciWorker(n)); // 워커를 이용한 피보나치 계산
        }

        await Promise.all(promises);

        performance.mark('end');

        performance.measure('Fibonacci Worker Thread', 'start', 'end');
        console.log(performance.getEntriesByName('Fibonacci Worker Thread'));
    }, 0);
});

import { parentPort, workerData } from 'worker_threads';

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 워커가 시작되면 주어진 n 값으로 피보나치를 계산
const n = workerData;
const result = fibonacci(n);

// 결과를 메인 스레드로 전송
parentPort.postMessage(result);

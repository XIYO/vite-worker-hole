import { parentPort, threadId } from 'worker_threads';
import hello from './slowLib.js';

// 워커가 메시지를 받으면 함수 호출
parentPort.on('message', async () => {
    const result = await hello(
        {delayTime: threadId < 5 ? 1000 : 100 }
    );
    parentPort.postMessage({ threadId, result });
});

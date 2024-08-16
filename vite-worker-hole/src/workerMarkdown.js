import {parentPort, workerData} from 'worker_threads';
import markdown from "./markdown.js";

// const result = await markdown(workerData);

// 결과를 메인 스레드로 전송
// parentPort.postMessage(structuredClone(result));


// 워커가 메시지를 받으면 함수 호출
parentPort.on('message', async (e) => {
    const result = await markdown(e);
    parentPort.postMessage(result);
});

import {parentPort, workerData} from 'worker_threads';
import markdown from "./markdown.js";

const result = await markdown(workerData);

// 결과를 메인 스레드로 전송
parentPort.postMessage(structuredClone(result));

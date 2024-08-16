import { describe, it, expect } from 'vitest';
import '@vitest/web-worker'; // 특정 테스트에서만 웹 워커를 사용하기 위해 여기서 불러옴
import MyWorker from '../src/worker?worker'; // 웹 워커를 가져옴

describe('Web Worker Test', () => {
    it('should process message correctly', (done) => {
        const worker = new MyWorker(); // 웹 워커 인스턴스 생성

        worker.postMessage('hello'); // 워커에 메시지 전송

        worker.onmessage = (e) => {
            try {
                console.log('Received response from worker:', e.data);
                expect(e.data).toBe('hello world'); // 결과가 예상대로인지 확인
                done(); // 테스트 완료
            } catch (error) {
                done(error); // 에러 발생 시 테스트 실패
            }
        };
    });
});

// 2초 지연을 추가
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const now = Date.now();
// 모듈이 로드될 때 2초 지연
await delay(2000);

let a = 0;

function randomDelay() {
    return new Promise(resolve => {
        const delayTime = Math.floor(Math.random() * 100); // 0~99ms 랜덤 딜레이
        setTimeout(resolve, delayTime);
    });
}

export default async function hello({delayTime}) {
    await new Promise(resolve => {
        setTimeout(resolve, delayTime);
    });
    const delta = Date.now() - now;
    return {delta, closureData: a++};
}

// worker.ts
self.onmessage = (e) => {
    console.log('this is worker', e.data);
    self.postMessage(`${e.data} world`)
}

const { parentPort } = require("worker_threads");

parentPort.on("message", (maxSize) => {
  //할일이 여기에 들어옴
  let sum = 0;
  for (let i = 0; i < maxSize; i++) {
    sum += 1;
  }
  parentPort.postMessage(sum);
  parentPort.close();
});

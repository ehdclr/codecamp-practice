const { Worker } = require("worker_threads");

const start = () => {
  let totalSum = 0;

  for (let i = 0; i < 9; i++) {
    const worker = new Worker("./worker.js"); // worker.js에서 처리해줘
    //worker가 9마리 생김
    worker.postMessage(1e9); //worker에게 일하라고 보내줌  9마리에게 10억번 일하라고
    worker.on("message",(result)=>{
        totalSum += result;
        console.log(`나는 ${i}번째 일꾼이고, 현재까지 총 합은 ${totalSum}이야F`)
    })// 워커들이 보낸 것을 받음
  }
};

start();

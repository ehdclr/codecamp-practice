const express = require("express")
// import {checkPhone ,getToken, sendTokenToSMS} from "./phone.js";

const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc");
const {options} = require('./swagger/config.js')

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(options)));

app.get("/boards", (req, res) => {
  const result = [
    {
      number: 1,
      writer: "철수",
      title: "제목입니다~",
      contents: "내용입니다.",
    },
    {
      number: 2,
      writer: "영희",
      title: "제목입니다~",
      contents: "내용입니다.",
    },
    {
      number: 3,
      writer: "영배",
      title: "제목입니다~",
      contents: "내용입니다.",
    },
  ];

  res.send(result);
});

app.post("/boards", (req, res) => {
  console.log(req);
  console.log("================");
  console.log(req.body);
});


app.listen(3000,()=>{
  console.log("server start")
})
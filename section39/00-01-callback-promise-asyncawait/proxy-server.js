const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors("*"));

app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get(
      "http://numbersapi.com/random?min=1&max=200"
    );
    return res.send(response.data);
  } catch (err) {
    throw new Error("에러!");
  }
});

app.post("/api/data2", async (req, res) => {
  try {
    
    const response = await axios.get(
      `http://koreanjson.com/posts/${req.body.num}`
    );
    return res.send(response.data);
  } catch (err) {
    throw new Error("에러!");
  }
});

app.post("/api/data3", async (req, res) => {
  try {
    const response = await axios.get(
      `http://koreanjson.com/posts?userId=${req.body.userId}`
    );
    return res.json(response.data);
  } catch (err) {
    throw new Error("에러!");
  }
});

app.listen(port, () => {
  console.log("express Proxy서버 실행중");
});

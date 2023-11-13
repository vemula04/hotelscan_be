const serverless = require("serverless-http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
// const indexRouter = require('./routes/index');
const tenantRouter = require("./routes/tenant");
const userRouter = require("./routes/user");
const tokenRouter = require("./routes/tokens");
const itemRouter = require("./routes/items");
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/', indexRouter);
app.use('/', tenantRouter);
app.use('/', userRouter);
app.use('/', tokenRouter);
app.use('/', itemRouter);
/*
app.get("/", (req, res, next) => {

  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});
*/
app.use((req, res, next) => {
  console.log(req.method, req.url)
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);

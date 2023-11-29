// const serverless = require("serverless-http");
const express = require("express");
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const app = express();
const upload = require("express-fileupload");
const bodyParser = require('body-parser');
// const indexRouter = require('./routes/index');
const tenantRouter = require("./routes/tenant");
const userRouter = require("./routes/user");
const tokenRouter = require("./routes/tokens");
const itemRouter = require("./routes/items");
// const uploadRouter = require('./routes/s3upload');
const server = http.createServer(app);
// Configuring body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());
app.use(upload());


// app.use('/', indexRouter);
app.use('/', tenantRouter);
app.use('/', userRouter);
app.use('/', tokenRouter);
app.use('/', itemRouter);
// app.use('/', uploadRouter);
// app.get("/", (req, res, next) => {

//   return res.status(200).json({
//     message: "Hello from root!",
//   });
// });
/*


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

// server.listen(process.env.PORT, function () {
//   console.log(`CORS-enabled web server listening on port ${process.env.PORT}`);
// });
// module.exports.handler = serverless(app);
module.exports = app;

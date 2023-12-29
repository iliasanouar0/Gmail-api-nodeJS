const express = require("express");
const fs = require('fs')
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
const routes = require("./routes");
app.use('/api', routes);
app.use(bodyParser.json())
const listManager = require('./managers/listManager')
const processManager = require('./managers/processManager')
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});



app.get("/", processManager.getData);
app.post("/:name", processManager.addProcess);
app.post("/p/:name", processManager.startProcess);

app.get("/lists", listManager.getData);
app.get("/lists/:list", listManager.getDataList);
const express = require("express");
const fs = require('fs')

require("dotenv").config();

const app = express();
const routes = require("./routes");
app.use('/api', routes);
const listManager = require('./managers/listManager')
// app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});



app.get("/", async (req, res) => {
  res.send('<div>test</div>');
});

app.get("/lists", listManager.getData);
const express = require("express");
const fs = require('fs')

require("dotenv").config();

const app = express();
const routes = require("./routes");
app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
  fs.readFile('/client/index.js', (e, d) => {
    if (e) {
      res.status(500).send(e)
      return e
    }
    console.log(d);
    res.send(d);
  })
});
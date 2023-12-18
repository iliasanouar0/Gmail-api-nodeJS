const express = require("express");

require("dotenv").config();

const app = express();
const routes=require("./routes");
app.use('/api',routes);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.get("/", async (req, res) => {
  // const result=await sendMail();
  res.send("Welcome to Gmail API with NodeJS");
});
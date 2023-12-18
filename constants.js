require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "iliasanouar0@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "THE-ONE <iliasanouar0@gmail.com>",
  to: "ilyasanouar01@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};
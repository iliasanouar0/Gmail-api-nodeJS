const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// router.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

router.get('/mail/user/:email', controllers.getUser)
router.get('/mail/send/:p', controllers.sendMail);
router.get('/mail/drafts/:email', controllers.getDrafts);
router.get('/mail/read/:messageId', controllers.readMail);

module.exports = router;

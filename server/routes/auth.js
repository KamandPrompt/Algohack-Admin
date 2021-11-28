var express = require("express");
var router = express.Router();
var auth = require("../controls/auth");

router.post('/login', auth.postLogin);

router.post('/logout', auth.postLogout);

router.post('/judge0-sumbit', auth.makeSubmissionJudge0);

module.exports = router;

const bcrypt = require('bcrypt');
var adminUser = require('../models/admin_user');
const passport = require('passport');
const axios = require('axios');

exports.postLogin = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, 'Cannot log in', info]);
    }

    req.login(user, err => {
      res.send('Logged in');
    });
  })(req, res, next);
}

exports.postLogout = async (req, res, next) => {
  req.logout();
  return res.send('Logged out');
}

exports.makeSubmissionJudge0 = async (req, res, next) => {
  req.body.stdin = req.body.stdin.replace(/\r\n/g, "\n");
  await axios.post('http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true', req.body)
    .then((response) => {
      return res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
}

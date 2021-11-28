var mongoose = require('mongoose');

var adminUser = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('AdminUser', adminUser);

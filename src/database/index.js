const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/api_controlerProducts", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);
mongoose.Promise = global.Promise;

module.exports = mongoose;

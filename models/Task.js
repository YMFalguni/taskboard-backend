const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: String,
  status: String
});
module.exports = mongoose.model('Task', TaskSchema);
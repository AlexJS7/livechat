const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

const threadSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  botId: String,
  userId: String,
  repId: [String],
  live: Boolean,
  source: String,
  messages: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

threadSchema.pre('update', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

threadSchema.pre('save', function (next) {
  this._id = uuidV4();
  this.updatedAt = new Date();
  next();
});

threadSchema.pre('findOneAndUpdate', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;

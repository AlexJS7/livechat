const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

const botSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  users: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

botSchema.pre('update', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

botSchema.pre('save', function (next) {
  this._id = uuidV4();
  this.updatedAt = new Date();
  next();
});

botSchema.pre('findOneAndUpdate', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;

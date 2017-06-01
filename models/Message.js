const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  threadId: String,
  senderId: String,
  fromBot: Boolean,
  fromRep: Boolean,
  text: String,
  attachment: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

messageSchema.pre('update', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

messageSchema.pre('save', function (next) {
  this._id = uuidV4();
  this.updatedAt = new Date();
  next();
});

messageSchema.pre('findOneAndUpdate', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

const mongoose = require('mongoose');
const mValidator = require('mongoose-validator');
const uuidV4 = require('uuid/v4');

const companySchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
    validate: [mValidator({
      validator: 'matches',
      arguments: ['^[a-z]{2,}$', 'i'],
    })],
  },
  admin: {
    type: String,
  },
  bots: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

companySchema.pre('update', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

companySchema.pre('save', function (next) {
  this._id = uuidV4();
  this.updatedAt = new Date();
  next();
});

companySchema.pre('findOneAndUpdate', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

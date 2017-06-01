const mongoose = require('mongoose');
const mValidator = require('mongoose-validator');
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');

/**
 * setting password function
 * @param value - password
 */
function setPassword(value) {
  const saltRounds = 10;
  return bcrypt.hashSync(value, bcrypt.genSaltSync(saltRounds));
}

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  username: String,
  password: {
    type: String,
    set: setPassword,
    required: [true, 'password is required'],
  },
  firstName: {
    type: String,
    trim: true,
    validate: [mValidator({
      validator: 'matches',
      arguments: ['^[a-z]{2,}$', 'i'],
    })],
  },
  lastName: {
    type: String,
    trim: true,
    validate: [mValidator({
      validator: 'matches',
      arguments: ['^[a-z]{2,}$', 'i'],
    })],
  },
  email: {
    type: String,
    trim: true,
    unique: [true, 'email has to be unique'],
    required: [true, 'email is required'],
    validate: [mValidator({ validator: 'isEmail' })],
  },
  companyId: {
    type: String,
  },
  threads: [String],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

userSchema.pre('update', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

userSchema.pre('save', function (next) {
  this._id = uuidV4();
  this.updatedAt = new Date();
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  this.update({}, { $set: { updatedAt: new Date() } });
  next();
});

userSchema.methods.comparePassword = function (pass, cb) {
  bcrypt.compare(pass, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

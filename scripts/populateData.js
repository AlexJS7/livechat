import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Company, Thread, User, Message, Bot } from 'chat-models';
import * as config from '../config/index.json';

dotenv.config();
mongoose.connect(process.env.MONGO_URI, config.mongoose.options);
mongoose.Promise = global.Promise;

// Pass in new company name and already existing botId
const companyName = process.argv[2];
const botId = process.argv[3];

const USERS_AMOUNT = 5;
const THREADS_AMOUNT = 20;

const generateUserData = (amount, companyId) => Promise.resolve()
  .then(() => {
    const users = [];
    const makeUser = (admin, index) => ({
      username: `berq${index}`,
      password: `berq${index}`,
      firstName: 'Berq',
      lastName: index.toString(),
      email: `berq${index}@${companyName}.me`,
      companyId,
      role: admin ? 'admin' : 'user',
    });
    for (let i = 0; i < amount; i += 1) {
      users.push(makeUser(i === 0, i));
    }
    return users;
  });

const generateThreadData = amount => Promise.resolve()
  .then(() => {
    const threads = [];
    for (let i = 0; i < amount; i += 1) {
      threads.push({
        botId,
        live: true,
        source: 'interact',
        messages: [],
      });
    }
    return threads;
  });

Promise.resolve()
  // Create company
  .then(() => {
    const company = new Company({ name: companyName, bots: [botId] });
    return company.save();
  })
  // Generate users
  .then(company => generateUserData(USERS_AMOUNT, company.toObject()._id))
  // Save users
  .then(users => Promise.all(users.map(user => new Promise((resolve) => {
    // return resolve(User.remove({ email: user.email }).exec())
    const u = new User(user);
    return resolve(u.save());
  }))))
  // .then(() => Promise.reject())
  // Update company with userIds
  .then(users => (Company.update(
    { _id: users[0].toObject().companyId },
    { $set: { users: users.map(user => user.toObject()._id) } },
  )).exec()
  // Create threads
  .then(() => generateThreadData(THREADS_AMOUNT))
  .then(threads => Promise.all(threads.map(thread => new Promise((resolve) => {
    const t = new Thread(thread);
    return resolve(t.save());
  })))))
  .then(threads => console.log('THEADS', threads))
  // // CLEAN UP ---
  // // Remove threads
  // .then(threads => Promise.all(threads.map(thread => Thread.remove({
  //   _id: thread.toObject()._id,
  // }).exec())))
  // .then(() => users))
  // // Remove users
  // .then(users => Promise.all(users.map(user => User.remove({
  //   _id: user.toObject()._id,
  // }).exec())))
  // // Remove company
  // .then(() => Company.remove({ name: companyName }).exec())
  // // --- CLEAN UP
  .then(process.exit)
  .catch((err) => {
    console.log('ERROR', err);
    process.exit();
  });

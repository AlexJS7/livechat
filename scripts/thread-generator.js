import dotenv from 'dotenv';
import mongoose from 'mongoose';
import commandLineArgs from 'command-line-args';
import randomstring from 'randomstring';
import { Thread, User, Message } from 'chat-models';
import getLogger from '../services/log.service';
import * as config from '../config/index.json';

dotenv.config();
mongoose.connect(process.env.MONGO_URI, config.mongoose.options);

const log = getLogger('thread-generator');

const optionDefinitions = [
  { name: 'email', alias: 'e', type: String },
  { name: 'quantity', alias: 'q', type: Number },
  { name: 'live', alias: 'l', type: Boolean, defaultOption: false },
];

const options = commandLineArgs(optionDefinitions);

(function generateThreads() {
  User.findOne({ email: options.email })
    .then((user) => {
      if (!user) {
        log.error('User not found');
      }
      return user;
    })
    .then((user) => {
      const newThreads = [];
      for (let i = 0; i < options.quantity; i += 1) {
        const newThread = new Thread({
          // botId and source hardcoded for this moment
          botId: 'ff003a21-1bf6-498d-8d9e-885907d8ccef',
          source: 'interact',
          live: options.live,
          userId: user._id,
          repIds: [user._id],
          messages: [],
        });
        newThreads.push(newThread.save());
      }
      Promise.all(newThreads)
        .then((threads) => {
          const newIds = user.threads.concat(threads.map(t => t._id));
          user.update({ threads: newIds })
            .then(() => log.info('User updated successfully'));
          return threads;
        })
        .then((threads) => {
          threads.forEach((thread, index) => {
            const newMessages = [];
            const messageQuantity = Math.floor((Math.random() * 10) + 1);
            for (let j = 0; j < messageQuantity; j += 1) {
              const newMsg = new Message({
                threadId: thread._id,
                text: randomstring.generate(10),
                senderId: user._id,
                attachment: {
                  type: 'image',
                  payload: {
                    url: 'https://s3-eu-west-1.amazonaws.com/interactbot/public/small-interact-logo-black.png',
                  },
                },
              });
              newMessages.push(newMsg.save());
            }
            Promise.all(newMessages)
              .then((messages) => {
                const msgIds = messages.map(msg => msg._id);
                thread.update({ messages: msgIds }, { new: true })
                  .then(() => {
                    log.info(`Thread ${thread._id} created successfully. Added ${messages.length} messages`);
                  })
                  .then(() => {
                    if (index === options.quantity - 1) process.exit(0);
                  });
              });
          });
        });
    })
    .catch(err => log.error(`Error ${err.msg}`));
}());

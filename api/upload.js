import { Message, Thread } from 'chat-models';
import AWS from 'aws-sdk';
import getLogger from '../services/log.service';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  subregion: 'us-west-2',
});

const log = getLogger('chat.controller');

function upload(req, res, next) {
  s3.upload({
    Bucket: 'interactbot',
    Key: `uploads/${req.file.originalname}`,
    Body: req.file.buffer,
    ACL: 'public-read',
  }, (err, data) => {
    if (err) {
      next(err);
    } else {
      Thread.findOne({ _id: req.params.threadId })
        .then((thread) => {
          if (!thread) {
            log.warn('No such thread');
            throw new Error('Thread not found');
          }
          return thread;
        })
        .then((thread) => {
          const newMsg = new Message({
            threadId: req.params.threadId,
            text: data.Location,
            attachment: {
              type: 'image',
              payload: {
                url: 'https://s3-eu-west-1.amazonaws.com/interactbot/public/small-interact-logo-black.png',
              },
            },
          });
          newMsg.save((err, msg) => {
            thread.update({ $push: { messages: msg._id } })
              .then(() => {
                res.json({
                  success: true,
                  message: msg,
                });
              });
          });
        })
        .catch(next);
    }
  });
}

export default upload;

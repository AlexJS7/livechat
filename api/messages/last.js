import { Message, Thread } from 'chat-models';

function last(req, res, next) {
  Thread.find({ live: { $exists: true } })
    .then((threads) => {
      const promiseList = threads.map(elem =>
        Message.find({ _id: { $in: elem.messages } })
          .sort({ createdAt: 1 })
          .limit(1),
      );
      Promise.all(promiseList)
        .then((messages) => {
          res.json({
            success: true,
            messages,
          });
        });
    })
    .catch(next);
}

export default last;

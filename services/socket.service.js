export default function (io) {
  const connections = [];
  const userConnections = {}

  io.on('connection', (socket) => {
    connections.push(socket);
    socket.on('chat mounted', ({ userId }) => {
      // userConnections[userId] = socket
      // console.log('chat has been mounted by socket.service.js', userConnections)

      // socket.emit('new message', { hi: 'hello!' })
      // socket.emit('send socket', socket.id);
    });
    // socket.on('new message', (data) => {
    //   console.log('in socket service: ', JSON.stringify(data));
    //   connections.forEach((connectedSocket) => {
    //     if (connectedSocket !== socket) {
    //       connectedSocket.emit('incoming message', data);
    //     }
    //   });
    // });

    socket.on('disconnect', () => {
      const index = connections.indexOf(socket);
      connections.splice(index, 1);
    });
  });
}

import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
// import io from 'socket.io';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import getLogger from './services/log.service';
import api from './api';
import * as config from './config/index.json';

dotenv.config();
const log = getLogger('app');
const socketsLog = getLogger('sockets');
const namespaces = {};

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);

io.on('connection', (s) => {
  s.on('join namespace', (nsp) => {
    if (namespaces[nsp]) {
      s.emit('join namespace', true);
    } else {
      namespaces[nsp] = io.of(nsp);
      namespaces[nsp].on('connection', (socket) => {
        socket.on('join', (room) => {
          socketsLog.info('joined: ', room);
          socket.join(room);
        });
        socket.on('set-admin', () => {
          socket.join('admin');
        });
      });
      s.emit('join namespace', true);
    }
  });
});

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.set('socketio', io);

// allows CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

mongoose.connect('mongodb://localhost:27017/chatbot' || process.env.MONGO_URI, config.mongoose.options);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('client/build/static'));

app.use('/', api);

app.use((err, req, res, next) => {
  log.warn(`${err.message}`);
  res.status(err.status || 500).send({
    name: err.name,
    message: err.message,
  });
});

app.get('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  }

  res.status(404);

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
  }
  res.type('txt').send('Not found');
});

// const socketIo = io(9000);
// socketService(socketIo);

server.listen(process.env.PORT);
log.info(`Server running on: http://localhost:${process.env.PORT}`);

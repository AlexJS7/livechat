import winston from 'winston';
import _ from 'lodash';
import * as config from '../config/index.json';

const transportsDefault = {
  console: {
    level: config.log.logLevel,
    colorize: config.log.colorize,
    timestamp: true,
  },
};

if (config.log.logToFile) {
  transportsDefault.file = {
    level: config.log.logLevel,
    filename: './logs/app.log',
    timestamp: true,
    json: false,
  };
}

const loggerDefault = (function () {
  const transport = _.cloneDeep(transportsDefault);

  const transports = [];
  transports.push(new (winston.transports.Console)(transport.console));
  if (config.log.logToFile) {
    transports.push(new (winston.transports.File)(transport.file));
  }

  return new (winston.Logger)({
    transports,
  });
}());

const loggerNames = [];

const getLogger = function (name) {
  if (!name) {
    return loggerDefault;
  }

  if (_.indexOf(loggerNames, name) === -1) {
    const transport = _.cloneDeep(transportsDefault);
    transport.console.label = name;
    if (config.log.logToFile) {
      transport.file.label = name;
      transport.file.filename = `./logs/${name}.log`;
    }
    winston.loggers.add(name, transport);
    loggerNames.push(name);
  }

  return winston.loggers.get(name);
};

export default getLogger;

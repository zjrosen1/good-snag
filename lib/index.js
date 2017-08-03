'use strict';

const _       = require('lodash');
const bugsnag = require('bugsnag');
const Hoek    = require('hoek');
const Stream  = require('stream');

const internals = {
  defaults: {
    config: {
      autoNotify: false,
    },
  },
};

class GoodSnag extends Stream.Writable {
  constructor(config = {}) {
    Hoek.assert(config.apiKey, 'apiKey must be specified.')

    super({ objectMode: true });

    bugsnag.register(config.apiKey, Hoek.applyToDefaults(internals.defaults.config, config))

    this.bugsnag = bugsnag;

    this.once('finish', () => {
      this._write();
    });
  }

  _write(data, encoding, next) {
    this.bugsnag.notify(this.format(data));
    next();
  }

  format(message) {
    let error;

    switch (message.event) {
      case 'error':
        error = message.error;
        break;
      case 'request':
      case 'log':
        error = this.formatLogError(message);
        break
      default:
        error = this.formatLogError(message);
        break;
    }

    return error;
  }

  formatLogError(message) {
    if (message.data instanceof Error) {
      const error = {
        name: message.data.name,
        message : message.data.message,
        stack: message.data.stack
      }

      if (message.data.isBoom) {
        error.statusCode = message.data.output.statusCode;
        error.data = message.data.data
      }

      message.error = Object.assign({}, error);
      delete message.data;
    }

    return message;
  }
}

module.exports = GoodSnag;

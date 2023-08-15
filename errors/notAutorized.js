const { ERROR_AUTH } = require('../utils/constants');

class NotAuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_AUTH;
  }
}

module.exports = NotAuthorized;

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  PORT = 3000,
  MONGO_DB = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  MONGO_DB,
};

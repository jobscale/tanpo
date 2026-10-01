const Sequelize = require('sequelize');
const { logger } = require('@jobscale/create-logger');
const { connection } = require('./connection');

const benchmark = true;
const logging = (sql, milliseconds, params) => {
  logger.info([sql, `benchmark: ${parseInt(milliseconds, 10)}`, params.bind || []]);
};

module.exports = {
  database: new Sequelize(connection.database, null, null, {
    replication: {
      write: {
        host: connection.writer,
        username: connection.username,
        password: connection.password,
      },
      read: (connection.readers || []).map(host => ({
        host,
        username: connection.username,
        password: connection.password,
      })),
    },
    dialect: connection.dialect,
    port: connection.port,
    storage: connection.storage,
    pool: {
      max: 2,
      min: 0,
      idle: 10000,
    },
    logging,
    benchmark,
  }),
};

const { logger } = require('@jobscale/logger');
const { App } = require('./app');
const { database } = require('./config/database');
const User = require('./app/models/User');
const { createHash } = require('./app/user');

const sampleUsers = () => {
  const loader = require;
  const sample = loader('./db/list-user.json');
  return Promise.all(sample.users.map(user => {
    const { login } = user;
    const hash = user.hash || createHash(`${login}/${'default'}`);
    return User.create({ login, hash });
  }));
};

const syncDB = async () => {
  await database.authenticate();
  await database.sync();
  await User.findAll({
    raw: true,
    attributes: ['login'],
  })
  .then(users => {
    if (users.length !== 0) return [];
    return sampleUsers()
    .catch(e => logger.error(e.message));
  });
};

const main = async () => {
  const dbSync = syncDB();
  const prom = {};
  prom.pending = new Promise(resolve => { prom.resolve = resolve; });
  const app = new App().start();
  const options = {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  };
  app.listen(options, () => dbSync.then(() => {
    logger.info(JSON.stringify({
      Server: 'Started',
      'Listen on': `http://127.0.0.1:${options.port}`,
    }, null, 2));
    prom.resolve(app);
  }));
  return prom.pending;
};

module.exports = {
  server: main(),
};

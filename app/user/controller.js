const path = require('path');
const { logger } = require('@jobscale/create-logger');
const { userService } = require('./service');

class UserController {
  async page(req, res) {
    const { url } = req;
    const view = path.join('user', url);
    const options = {
      now: await userService.now(),
    };
    switch (view) {
    case 'user/':
      options.title = 'Users';
      options.users = await userService.findAll();
      res.render(view, options);
      break;
    default:
      res.render(view, options);
      break;
    }
  }

  register(req, res) {
    const { login, password } = req.body;
    userService.register({ login, password })
    .then(user => {
      res.json({ user });
    })
    .catch(e => {
      logger.info({ message: e.toString() });
      if (!e.status) e.status = 503;
      res.status(e.status).json({ message: e.message });
    });
  }

  reset(req, res) {
    const { login, password } = req.body;
    userService.reset({ login, password })
    .then(user => {
      res.json({ user });
    })
    .catch(e => {
      logger.info({ message: e.toString() });
      if (!e.status) e.status = 503;
      res.status(e.status).json({ message: e.message });
    });
  }
}

module.exports = {
  UserController,
  userController: new UserController(),
};

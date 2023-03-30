const os = require('os');
const path = require('path');
const createHttpError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { logger } = require('@jobscale/logger');
const { route } = require('./route');

const app = express();

class App {
  useView() {
    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'ejs');
  }

  useParser() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
  }

  useHeader() {
    app.set('etag', false);
    app.set('x-powered-by', false);
    app.use((req, res, next) => {
      const referer = req.headers.referer && req.headers.referer.match(/https?:\/\/[a-z0-9.:]+/g);
      const origin = req.headers.origin || (referer && referer[0]) || `${req.protocol}://${req.headers.host}`;
      res.header('Access-Control-Allow-Origin', `${origin}`);
      res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Server', 'acl-ingress-k8s');
      res.header('X-Backend-Host', os.hostname());
      res.header('Content-Security-Policy', "default-src 'none'; base-uri 'none'; form-action 'self' https:; connect-src https: wss:; font-src 'self' data: https:; frame-src 'self' https:; frame-ancestors 'self'; img-src 'self' data: https:; script-src 'self'; script-src-elem 'self' https:; style-src 'self' 'unsafe-inline' https:; prefetch-src 'self'; manifest-src 'self'");
      res.header('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
      res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.header('Strict-Transport-Security', 'max-age=31536000; includeSubdomains; preload');
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'SAMEORIGIN');
      res.header('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  usePublic() {
    const docs = path.resolve(process.cwd(), 'docs');
    app.use(express.static(docs));
  }

  useLogging() {
    app.use((req, res, next) => {
      const ts = new Date().toLocaleString();
      const progress = () => {
        const remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { protocol, method, url } = req;
        const headers = JSON.stringify(req.headers);
        logger.info({
          ts, remoteIp, protocol, method, url, headers,
        });
      };
      progress();
      res.on('finish', () => {
        const { statusCode, statusMessage } = res;
        const headers = JSON.stringify(res.getHeaders());
        logger.info({
          ts, statusCode, statusMessage, headers,
        });
      });
      next();
    });
  }

  useRoute() {
    app.use('', route.router);
  }

  notfoundHandler() {
    app.use((req, res) => {
      const template = 'error/default';
      if (req.method === 'GET') {
        const e = createHttpError(404);
        res.locals.e = e;
        res.status(e.status).render(template);
        return;
      }
      const e = createHttpError(501);
      res.status(e.status).json({ message: e.message });
    });
  }

  errorHandler() {
    app.use((e, req, res, done) => {
      (never => never)(done);
      const template = 'error/default';
      if (!e.status) e.status = 503;
      if (req.method === 'GET') {
        res.locals.e = e;
        res.status(e.status).render(template);
        return;
      }
      res.status(e.status).json({ message: e.message });
    });
  }

  start() {
    this.useView();
    this.useParser();
    this.useHeader();
    this.usePublic();
    this.useLogging();
    this.useRoute();
    this.notfoundHandler();
    this.errorHandler();
    return app;
  }
}

module.exports = {
  App,
};

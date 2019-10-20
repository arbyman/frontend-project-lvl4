"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _koa = _interopRequireDefault(require("koa"));

var _koaPug = _interopRequireDefault(require("koa-pug"));

var _socket = _interopRequireDefault(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _koaWebpack = _interopRequireDefault(require("koa-webpack"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaGenericSession = _interopRequireDefault(require("koa-generic-session"));

var _lodash = _interopRequireDefault(require("lodash"));

var _routes = _interopRequireDefault(require("./routes"));

var _webpack = _interopRequireDefault(require("../webpack.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @flow
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

var _default = () => {
  const app = new _koa.default();
  app.keys = ['some secret hurr'];
  app.use((0, _koaGenericSession.default)(app));
  app.use((0, _koaBodyparser.default)()); // app.use(serve(path.join(__dirname, '..', 'public')));

  if (isDevelopment) {
    (0, _koaWebpack.default)({
      config: _webpack.default
    }).then(middleware => {
      app.use(middleware);
    });
  } else {
    const urlPrefix = '/assets';

    const assetsPath = _path.default.resolve(`${__dirname}/../dist/public`);

    app.use((0, _koaMount.default)(urlPrefix, (0, _koaStatic.default)(assetsPath)));
  }

  const router = new _koaRouter.default();
  app.use((0, _koaLogger.default)());
  const pug = new _koaPug.default({
    viewPath: _path.default.join(__dirname, '..', 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    noCache: process.env.NODE_ENV !== 'production',
    basedir: _path.default.join(__dirname, 'views'),
    helperPath: [{
      _: _lodash.default
    }, {
      urlFor: (...args) => router.url(...args)
    }]
  });
  pug.use(app);

  const server = _http.default.createServer(app.callback());

  const io = (0, _socket.default)(server);
  (0, _routes.default)(router, io);
  app.use(router.allowedMethods());
  app.use(router.routes());
  return server;
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9pbmRleC5qcyJdLCJuYW1lcyI6WyJpc1Byb2R1Y3Rpb24iLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJpc0RldmVsb3BtZW50IiwiYXBwIiwiS29hIiwia2V5cyIsInVzZSIsImNvbmZpZyIsIndlYnBhY2tDb25maWciLCJ0aGVuIiwibWlkZGxld2FyZSIsInVybFByZWZpeCIsImFzc2V0c1BhdGgiLCJwYXRoIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsInJvdXRlciIsIlJvdXRlciIsInB1ZyIsIlB1ZyIsInZpZXdQYXRoIiwiam9pbiIsImRlYnVnIiwicHJldHR5IiwiY29tcGlsZURlYnVnIiwibG9jYWxzIiwibm9DYWNoZSIsImJhc2VkaXIiLCJoZWxwZXJQYXRoIiwiXyIsInVybEZvciIsImFyZ3MiLCJ1cmwiLCJzZXJ2ZXIiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwiY2FsbGJhY2siLCJpbyIsImFsbG93ZWRNZXRob2RzIiwicm91dGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFqQkE7QUFtQkEsTUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixZQUE5QztBQUNBLE1BQU1DLGFBQWEsR0FBRyxDQUFDSixZQUF2Qjs7ZUFFZSxNQUFNO0FBQ25CLFFBQU1LLEdBQUcsR0FBRyxJQUFJQyxZQUFKLEVBQVo7QUFFQUQsRUFBQUEsR0FBRyxDQUFDRSxJQUFKLEdBQVcsQ0FBQyxrQkFBRCxDQUFYO0FBQ0FGLEVBQUFBLEdBQUcsQ0FBQ0csR0FBSixDQUFRLGdDQUFRSCxHQUFSLENBQVI7QUFDQUEsRUFBQUEsR0FBRyxDQUFDRyxHQUFKLENBQVEsNkJBQVIsRUFMbUIsQ0FNbkI7O0FBQ0EsTUFBSUosYUFBSixFQUFtQjtBQUNqQiw2QkFBVztBQUNUSyxNQUFBQSxNQUFNLEVBQUVDO0FBREMsS0FBWCxFQUVHQyxJQUZILENBRVNDLFVBQUQsSUFBZ0I7QUFDdEJQLE1BQUFBLEdBQUcsQ0FBQ0csR0FBSixDQUFRSSxVQUFSO0FBQ0QsS0FKRDtBQUtELEdBTkQsTUFNTztBQUNMLFVBQU1DLFNBQVMsR0FBRyxTQUFsQjs7QUFDQSxVQUFNQyxVQUFVLEdBQUdDLGNBQUtDLE9BQUwsQ0FBYyxHQUFFQyxTQUFVLGlCQUExQixDQUFuQjs7QUFDQVosSUFBQUEsR0FBRyxDQUFDRyxHQUFKLENBQVEsdUJBQU1LLFNBQU4sRUFBaUIsd0JBQU1DLFVBQU4sQ0FBakIsQ0FBUjtBQUNEOztBQUVELFFBQU1JLE1BQU0sR0FBRyxJQUFJQyxrQkFBSixFQUFmO0FBRUFkLEVBQUFBLEdBQUcsQ0FBQ0csR0FBSixDQUFRLHlCQUFSO0FBQ0EsUUFBTVksR0FBRyxHQUFHLElBQUlDLGVBQUosQ0FBUTtBQUNsQkMsSUFBQUEsUUFBUSxFQUFFUCxjQUFLUSxJQUFMLENBQVVOLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsT0FBM0IsQ0FEUTtBQUVsQk8sSUFBQUEsS0FBSyxFQUFFLElBRlc7QUFHbEJDLElBQUFBLE1BQU0sRUFBRSxJQUhVO0FBSWxCQyxJQUFBQSxZQUFZLEVBQUUsSUFKSTtBQUtsQkMsSUFBQUEsTUFBTSxFQUFFLEVBTFU7QUFNbEJDLElBQUFBLE9BQU8sRUFBRTNCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBTmhCO0FBT2xCMEIsSUFBQUEsT0FBTyxFQUFFZCxjQUFLUSxJQUFMLENBQVVOLFNBQVYsRUFBcUIsT0FBckIsQ0FQUztBQVFsQmEsSUFBQUEsVUFBVSxFQUFFLENBQ1Y7QUFBRUMsTUFBQUEsQ0FBQyxFQUFEQTtBQUFGLEtBRFUsRUFFVjtBQUFFQyxNQUFBQSxNQUFNLEVBQUUsQ0FBQyxHQUFHQyxJQUFKLEtBQWFmLE1BQU0sQ0FBQ2dCLEdBQVAsQ0FBVyxHQUFHRCxJQUFkO0FBQXZCLEtBRlU7QUFSTSxHQUFSLENBQVo7QUFhQWIsRUFBQUEsR0FBRyxDQUFDWixHQUFKLENBQVFILEdBQVI7O0FBRUEsUUFBTThCLE1BQU0sR0FBR0MsY0FBS0MsWUFBTCxDQUFrQmhDLEdBQUcsQ0FBQ2lDLFFBQUosRUFBbEIsQ0FBZjs7QUFDQSxRQUFNQyxFQUFFLEdBQUcscUJBQU9KLE1BQVAsQ0FBWDtBQUVBLHVCQUFVakIsTUFBVixFQUFrQnFCLEVBQWxCO0FBQ0FsQyxFQUFBQSxHQUFHLENBQUNHLEdBQUosQ0FBUVUsTUFBTSxDQUFDc0IsY0FBUCxFQUFSO0FBQ0FuQyxFQUFBQSxHQUFHLENBQUNHLEdBQUosQ0FBUVUsTUFBTSxDQUFDdUIsTUFBUCxFQUFSO0FBRUEsU0FBT04sTUFBUDtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBLb2EgZnJvbSAna29hJztcbmltcG9ydCBQdWcgZnJvbSAna29hLXB1Zyc7XG5pbXBvcnQgc29ja2V0IGZyb20gJ3NvY2tldC5pbyc7XG5pbXBvcnQgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCBtb3VudCBmcm9tICdrb2EtbW91bnQnO1xuaW1wb3J0IHNlcnZlIGZyb20gJ2tvYS1zdGF0aWMnO1xuaW1wb3J0IFJvdXRlciBmcm9tICdrb2Etcm91dGVyJztcbmltcG9ydCBrb2FMb2dnZXIgZnJvbSAna29hLWxvZ2dlcic7XG5pbXBvcnQga29hV2VicGFjayBmcm9tICdrb2Etd2VicGFjayc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdrb2EtYm9keXBhcnNlcic7XG5pbXBvcnQgc2Vzc2lvbiBmcm9tICdrb2EtZ2VuZXJpYy1zZXNzaW9uJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgYWRkUm91dGVzIGZyb20gJy4vcm91dGVzJztcblxuaW1wb3J0IHdlYnBhY2tDb25maWcgZnJvbSAnLi4vd2VicGFjay5jb25maWcnO1xuXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuY29uc3QgaXNEZXZlbG9wbWVudCA9ICFpc1Byb2R1Y3Rpb247XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEtvYSgpO1xuXG4gIGFwcC5rZXlzID0gWydzb21lIHNlY3JldCBodXJyJ107XG4gIGFwcC51c2Uoc2Vzc2lvbihhcHApKTtcbiAgYXBwLnVzZShib2R5UGFyc2VyKCkpO1xuICAvLyBhcHAudXNlKHNlcnZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdwdWJsaWMnKSkpO1xuICBpZiAoaXNEZXZlbG9wbWVudCkge1xuICAgIGtvYVdlYnBhY2soe1xuICAgICAgY29uZmlnOiB3ZWJwYWNrQ29uZmlnLFxuICAgIH0pLnRoZW4oKG1pZGRsZXdhcmUpID0+IHtcbiAgICAgIGFwcC51c2UobWlkZGxld2FyZSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdXJsUHJlZml4ID0gJy9hc3NldHMnO1xuICAgIGNvbnN0IGFzc2V0c1BhdGggPSBwYXRoLnJlc29sdmUoYCR7X19kaXJuYW1lfS8uLi9kaXN0L3B1YmxpY2ApO1xuICAgIGFwcC51c2UobW91bnQodXJsUHJlZml4LCBzZXJ2ZShhc3NldHNQYXRoKSkpO1xuICB9XG5cbiAgY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG4gIGFwcC51c2Uoa29hTG9nZ2VyKCkpO1xuICBjb25zdCBwdWcgPSBuZXcgUHVnKHtcbiAgICB2aWV3UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3ZpZXdzJyksXG4gICAgZGVidWc6IHRydWUsXG4gICAgcHJldHR5OiB0cnVlLFxuICAgIGNvbXBpbGVEZWJ1ZzogdHJ1ZSxcbiAgICBsb2NhbHM6IFtdLFxuICAgIG5vQ2FjaGU6IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsXG4gICAgYmFzZWRpcjogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3ZpZXdzJyksXG4gICAgaGVscGVyUGF0aDogW1xuICAgICAgeyBfIH0sXG4gICAgICB7IHVybEZvcjogKC4uLmFyZ3MpID0+IHJvdXRlci51cmwoLi4uYXJncykgfSxcbiAgICBdLFxuICB9KTtcbiAgcHVnLnVzZShhcHApO1xuXG4gIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5jYWxsYmFjaygpKTtcbiAgY29uc3QgaW8gPSBzb2NrZXQoc2VydmVyKTtcblxuICBhZGRSb3V0ZXMocm91dGVyLCBpbyk7XG4gIGFwcC51c2Uocm91dGVyLmFsbG93ZWRNZXRob2RzKCkpO1xuICBhcHAudXNlKHJvdXRlci5yb3V0ZXMoKSk7XG5cbiAgcmV0dXJuIHNlcnZlcjtcbn07XG4iXX0=
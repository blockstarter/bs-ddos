// Generated by LiveScript 1.5.0
(function(){
  var iptable, now, getType, ban, reject, setup;
  iptable = {
    'static': {},
    api: {}
  };
  now = function(){
    return new Date().getTime();
  };
  getType = function(url){
    switch (false) {
    case url.indexOf('/api') !== 0:
      return 'api';
    default:
      return 'static';
    }
  };
  ban = function(config, c){
    c.stops = 0;
    return c.ban = now() + config.ban;
  };
  reject = function(req, c){
    c.stops += 1;
    return req.socket.destroy();
  };
  setup = function(config){
    return function(req, res, next){
      var type, table, ip, c, ref$, lastUpdate, diff;
      type = getType(req.originalUrl);
      table = iptable[type];
      ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      c = table[ip] = (ref$ = table[ip]) != null
        ? ref$
        : {
          lastUpdate: null,
          stops: 0,
          ban: null
        };
      if (c.stops > 3) {
        ban(config, c);
      }
      if (c.ban != null && c.ban > now()) {
        return req.socket.destroy();
      }
      c.ban = null;
      lastUpdate = c.lastUpdate;
      c.lastUpdate = now();
      if (lastUpdate === null) {
        return next();
      }
      diff = now() - lastUpdate;
      if (diff < config[type]) {
        return reject(req, c);
      }
      return next();
    };
  };
  module.exports = setup;
}).call(this);

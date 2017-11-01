iptable = { static: {}, api: {} }

now = ->
    new Date!.get-time!
get-type = (url)->
    | url.index-of(\/api) is 0 => \api
    | _ => \static
ban = (config, c)->
    c.stops = 0
    c.ban = now! + config.ban
reject = (req, c)->
    c.stops += 1
    req.socket.destroy! 
setup = (config)-> (req, res, next)->
    type = get-type req.original-url
    table = iptable[type]
    ip = req.headers[\x-forwarded-for] or req.connection.remote-address
    c = table[ip] = table[ip] ? { last-update: null, stops: 0, ban: null }
    ban config, c if c.stops > 3
    return req.socket.destroy! if c.ban? and c.ban > now!
    c.ban = null
    last-update = c.last-update
    c.last-update = now!
    return next! if last-update is null
    diff = now! - last-update
    return reject req, c if diff < config[type]
    next!

module.exports = setup
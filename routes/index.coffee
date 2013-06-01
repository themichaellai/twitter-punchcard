twitter = require '../lib/twitter'
exports.index = (req, res) ->
  res.render('index', { title: 'Express' })

exports.get_timeline = (req, res) ->
  twitter.getTimeline req.user, 1, (data) ->
    res.send data

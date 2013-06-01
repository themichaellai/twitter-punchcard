twitter = require '../lib/twitter'
exports.index = (req, res) ->
  res.render('index', { title: 'Twitter Timecard' })

exports.get_timeline = (req, res) ->
  twitter.getTimeline req.params.user, 1, (data) ->
    res.send data

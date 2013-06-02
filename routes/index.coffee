twitter = require '../lib/twitter'
exports.index = (req, res) ->
  console.log req.params
  res.render('index', {
    title: 'Twitter Punchcard',
    user: req.params.user
  })

exports.get_timeline = (req, res) ->
  twitter.getTimeline req.params.user, 1, (data) ->
    res.send data

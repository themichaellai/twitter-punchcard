OAuth = require('oauth').OAuth
config = undefined
try
  config = require '../config'
catch err
  config = {}

twitter = module.exports


accessToken = process.env.ACCESS_TOKEN || config.accessToken
accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || config.accessTokenSecret
consumerKey = process.env.CONSUMER_KEY || config.consumerKey
consumerSecret = process.env.CONSUMER_SECRET || config.consumerSecret

oa = new OAuth('https://api.twitter.com/oauth/request_token',
  "https://api.twitter.com/oauth/access_token",
  consumerKey,
  consumerSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
)
# store last id, and have param to use max-id if requested more data
twitter.getTimeline = (user, page, callback) ->
  oa.get("https://api.twitter.com/1.1/statuses/user_timeline.json?trim_user=1&count=#{page * 200}&screen_name=#{user}", accessToken, accessTokenSecret, (err, data) ->
    if (err)
      console.log err
      callback('[]')
    else
      callback(data)
  )

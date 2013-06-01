OAuth = require('oauth').OAuth
config = require '../config'

twitter = module.exports

oa = new OAuth('https://api.twitter.com/oauth/request_token',
  "https://api.twitter.com/oauth/access_token",
  config.consumerKey,
  config.consumerSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
)
# store last id, and have param to use max-id if requested more data
twitter.getTimeline = (user, page, callback) ->
  oa.get('https://api.twitter.com/1.1/statuses/user_timeline.json?trim_user=1&screen_name=#{user}&count=#{200*page}', config.accessToken, config.accessTokenSecret, (err, data) ->
    if (err)
      console.log err
    else
      callback(data)
  )

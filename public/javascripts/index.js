(function($) {
  var getUserTweets = function (user, callback) {
    $.get('/tweets/' + user + '/1.json', function (data) {
      callback($.parseJSON(data));
    });
  };

  var getData = function(user, callback) {
    getUserTweets(user, function(tweets) {
      var counts = {};
      for (var i=0; i < 7; i++) {
        counts[i] = {};
        for (var j=0; j < 24; j++) {
          counts[i][j] = 0;
        }
      }
      if (tweets.length > 0) {
        dates = {
          'end': new Date(tweets[0].created_at),
          'start': new Date(tweets[tweets.length - 1].created_at),
          'count': tweets.length
        };
      }
      _.each(tweets, function(tweet) {
        var date = new Date(tweet.created_at);
        counts[date.getDay()][date.getHours()]++;
      });
      var data = [];
      _.each(_.keys(counts), function(day) {
        _.each(_.keys(counts[day]), function(hour) {
          data.push({'day': parseInt(day, 10), 'hour': parseInt(hour, 10), 'count': counts[day][hour]});
        });
      });

      data = _.filter(data, function(d) { return d.count > 0; });
      callback(data, dates);
    });
  };
  var toHumanHours = function(hourInt) {
    var num = (hourInt === 0 || hourInt == 12) ? 12 : hourInt % 12;
    var period = (hourInt / 12 >= 1) ? 'pm' : 'am';
    return '' + num + period;
  };

  var data = [];
  var w = 1000, h = 550;
  var x = d3.scale.linear()
    .domain([0, 23])
    .range([0, w - (w/24) - 40]);
  var y = d3.scale.linear()
    .domain([0, 6])
    .range([0, h - (h/7) - (w/24)]);
  var chart = d3.select('#chart').append('svg')
    .attr('class', 'chartf')
    .attr('width', w)
    .attr('height', h)
    .append('g')
      .attr('transform', 'translate(40, 20)');

  chart.selectAll('.xrule')
    .data(x.ticks(24))
    .enter().append('text')
      .attr('class', 'xrule')
      .attr('x', function(d) { return x(d) + 15; })
      .attr('y', 0)
      .attr('dy', -3)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .text(toHumanHours);
  var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  chart.selectAll('.yrule')
    .data(y.ticks(7))
    .enter().append('text')
      .attr('class', 'yrule')
      .attr('x', 0)
      .attr('y', function(d) { return y(d) + w/24 + 3; })
      .attr('dx', -25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .text(function (d) { return days[parseInt(d, 10)]; });

  var populate = function(user, callback) {
    getData(user, function(data, dates) {
      if (data.length !== 0) {
        $('#tweet-num').text(dates.count);
        $('#dates').text((dates.start.getMonth() + 1) + '/' + dates.start.getDate() + '/' + dates.start.getFullYear() + ' to ' + (dates.end.getMonth() + 1) + '/' + dates.end.getDate() + '/' + dates.end.getFullYear());
        $('#date-range').slideDown();
        $('#errors').slideUp();
        var max = _.max(data, function(d) { return d.count; }).count;
        r = d3.scale.linear()
          .domain([0, max])
          .range([0, w/48]);

        circ = chart.selectAll('circle')
          .data(data, function(d) { return "" + d.hour + d.day; });

        circ.enter().append('circle')
          .attr('cx', function(d) { return x(d.hour) + 15; })
          .attr('cy', function(d) { return y(d.day) + w/24; })
          .attr('r', function(d) { return 0; })
          .style('fill', '#444');

        circ.transition()
          .duration(1000)
          .attr('r', function(d) { return r(d.count); });

        circ.exit().transition()
          .duration(1000)
          .attr('r', function(d) { return 0; })
          .remove('circle');
      } else {
        $('#errors').text('Could not find any tweets for this user!').slideDown();
      }
    });
    if (callback)
      callback();
  };

  var triggered = function() {
    var user = $('#handle').val();
    $('#loading').fadeIn().css('display', 'inline-block');
    populate(user, function() {
      $('#loading').fadeOut();
    });
    $('#permalink').html('<a href="/' + user + '">permalink</a> to this graph').fadeIn();
  };
  $('#handle').keyup(function(e){
    if (e.keyCode == 13) {
      triggered();
    }
  });
  $('#go').click(function() {
    triggered();
  });

  if (window.paramUser) {
    $('#loading').fadeIn().css('display', 'inline-block');
    populate(window.paramUser, function() {
      $('#loading').fadeOut();
    });
    $('#permalink').html('<a href="/' + window.paramUser + '">permalink</a> to this graph').fadeIn();
  }

})(jQuery);

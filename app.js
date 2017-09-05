/*
  This is the backend of our code that processes data from the
  instagram API and serves endpoints to our frontend. 

*/

var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();
var latestpostlikes = require('./latestpostlikes.json');
var port = process.env.PORT || 3000;

/*
  Ideally each of our endpoints would be able to query the
  Instagram API, process the JSON data retrieved from it
  and then send the processed data to our frontend. However
  due to issues getting OAuth working across queries our
  endpoints have a default fallback hardcoded value. For
  future improvements we would want to fix this OAuth
  issue and tidy up the code surrounding our attempt to
  get this working as currently, in the nature of this
  code been written at a hackfest, it is very hacked 
  together in an attempt to get it working. Currently we
  can query and retrieve data from the Instagram API when
  manually navigating to the authorizing, but when deployed
  as an app the system doesnt function properly.
*/

app.get('/latestpostlikes', function(req, res) {
  res.send(latestpostlikes.posts[0]);
});


var mediaSaved;
var followersSaved;
var isLoggedIn;


app.get('/timeofmostrecentpost', function(req,res){
  var time = 1502594035;
  res.send({time});
});


var prevLikes = 2;
app.get('/likestoday', function(req,res){
    if(!mediaSaved){
      var likesTdy = 5;
      res.send({likesTdy});
    }
    else{
    var totalLikes = mediaSaved.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);
    var likesTdy = totalLikes - prevLikes;
    res.send({likesTdy});
  }
});

var prevComments = 3;
app.get('/commentstoday', function(req,res){
    if(!mediaSaved){
      var commentsTdy= 6;
      res.send({commentsTdy});
    }
    else{
    var totalComments = mediaSaved.reduce(function(sum, value) {
            return sum + value.comments.count;
          }, 0);
    var commentsTdy = totalComments - prevComments;
    res.send({commentsTdy});
  }
});

app.get('/totallikes', function(req,res){
 if(!mediaSaved){
      var totalLikes = 73;
      res.send({totalLikes});
    }
else{
    var totalLikes = mediaSaved.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);
    res.send({totalLikes});
  }
});

app.get('/totalcomments', function(req,res){
    if(!mediaSaved){
      var totalComments = 9;
      res.send({totalComments})
    }
    else{
    var totalComments = mediaSaved.reduce(function(sum, value) {
            return sum + value.comments.count;
          }, 0);
    res.send({totalComments});
  }
});


var prevFollowers = 1;
app.get('/followerstoday', function(req,res){
if(!followersSaved){
    var totfol = 2;
    res.send({totfol});
}
else{
  var totfol = followersSaved.length - prevFollowers;
  res.send({totfol});
}
});



app.get('/totalfollowers', function(req,res){
  if(!followersSaved){
    var totfol = 3;
    res.send({totfol});
  }
  else{
    var totfol = followersSaved;

  res.send({totfol});
  }
});


app.get('/engagementtoday', function(req, res){
  var engtoday = 34;
  res.send({engtoday});
});

app.get('/totalengagement', function(req, res){
  var toteng = 151;
  res.send({toteng});
});



var calcbesthour = function(latestpostlikes){
  var likesovertime = latestpostlikes.posts[0].likesOverTime;
  var besthourCount = null
  var bestHour = null;
  Object.keys(likesovertime).forEach(function (hour) {
      var countForHour = likesovertime[hour];
      if (countForHour > besthourCount) {
          bestHour = hour;
          besthourCount = countForHour;
      }
  });
  return {
    bestHourMessage: TIMES_MAP[bestHour]
  };
};

app.get('/besthourtopost', function(req, res){
  var besthour = calcbesthour(latestpostlikes);
  res.send(besthour);
});

app.use(express.static("static"));

api.use({
  client_id: '2baab622a9d44a9d962742f3ba2ae74d',
  client_secret: 'd5145e8c983745f0bef2263a20f9d9bc'
});

var redirect_uri = 'http://127.0.0.1:3000/handleauth';

var authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes', 'follower_list'], state: 'a state' }));
};

var handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      //console.log(err.body);
      res.send("Didn't work");
    } else {
      isLoggedIn = true;
      console.log("Connection succeeded. Access token is"  + result.access_token);
      api.use({
        access_token: result.access_token
      });
      console.log(result.access_token);
      api.user_self_media_recent(function(err, medias, pagination, remaining, limit) {
       mediaSaved = medias;
        api.user_followers(medias[0].user.id, function(err, users, pagination, remaining, limit) {
          followersSaved = users;
          var followers = users;
          var likes = medias[0].likes;
          var comments = medias[0].comments;
          var tags = medias[0].tags;
          var top5 = JSON.parse(JSON.stringify(medias));
          top5.sort(function(a, b) {
            return b.likes.count - a.likes.count;
          });
          top5 = top5.slice(0, 5);
          var totalLikes = medias.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);
          var totalComments = medias.reduce(function(sum, value) {
            return sum + value.comments.count;
          }, 0);
          var variables = { medias, followers, likes, comments, tags, top5, totalLikes, totalComments };
        });
      });
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', authorize_user);
// This is your redirect URI
app.get('/handleauth', handleauth);

app.get('/', function(req, res) {
  res.redirect('/authorize_user');
});

app.listen(port, function () {
  console.log('App listening on port ' + port)
});


// used to convert from 24hour to am/pm
const TIMES_MAP = {
        "00": "12 am",
        "01": "1 am",
        "02": "2 am",
        "03": "3 am",
        "04": "4 am",
        "05": "5 am",
        "06": "6 am",
        "07": "7 am",
        "08": "8 am",
        "09": "9 am",
        "10": "10 am",
        "11": "11 am",
        "12": "12 pm",
        "13": "1 pm",
        "14": "2 pm",
        "15": "3 pm",
        "16": "4 pm",
        "17": "5 pm",
        "18": "6 pm",
        "19": "7 pm",
        "20": "8 pm",
        "21": "9 pm",
        "22": "10 pm",
        "23": "11 pm"

}

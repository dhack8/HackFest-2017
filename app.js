var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();

var latestpostlikes = require('./latestpostlikes.json');

<<<<<<< HEAD
var port = process.env.PORT || 8080;


console.log(latestpostlikes.posts[0].id);
=======
>>>>>>> upstream/master

app.get('/latestpostlikes', function(req, res) {
  res.send(latestpostlikes.posts[0]);
});


var mediaSaved;
var followersSaved;
var isLoggedIn;

function populateData(){

}

var calclikestoday = function(){

  api.user_self_media_recent(function(err, medias, pagination, remaining, limit) {
    var totalLikes = medias.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);


    return totalLikes;
  });
}


var prevLikes = 2;

app.get('/likestoday', function(req,res){
    if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

    var totalLikes = mediaSaved.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);


    var likesTdy = totalLikes - prevLikes;

    res.send({likesTdy});
});

var prevComments = 3;

app.get('/commentstoday', function(req,res){
    if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

    var totalComments = mediaSaved.reduce(function(sum, value) {
            return sum + value.comments.count;
          }, 0);


    var commentsTdy = totalComments - prevComments;

    res.send({commentsTdy});
});



app.get('/totallikes', function(req,res){
 if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

    var totalLikes = mediaSaved.reduce(function(sum, value) {
            return sum + value.likes.count;
          }, 0);

    res.send({totalLikes});

});

app.get('/totalcomments', function(req,res){
    if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

    var totalComments = mediaSaved.reduce(function(sum, value) {
            return sum + value.comments.count;
          }, 0);


    res.send({totalComments});
});



app.get('/followerstoday', function(req,res){

  if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

  
  var totfol = followersSaved.length - prevFollowers;

  res.send({totfol});

});

var prevFollowers = 2;

app.get('/totalfollowers', function(req,res){

  if(!isLoggedIn){
      res.redirect('/authorize_user');
    }

  var totfol = followersSaved.length;

  res.send({totfol});



});


app.get('/engagementtoday', function(req, res){

});

app.get('/totalengagement', function(req, res){

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
    bestHourMessage: "Best time for you to post is<br>" + TIMES_MAP[bestHour]
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

app.set("view engine", "ejs");

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
       //console.log(medias);
       //console.log(mediaSaved);

        api.user_followers(medias[0].user.id, function(err, users, pagination, remaining, limit) {
          followersSaved = users;
          // console.log(err);
          // console.log(users);

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

          var variables = {medias, followers, likes, comments, tags, top5, totalLikes, totalComments};

          res.render("index.html.ejs", variables);
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
  //res.sendFile('static/index.html');
  res.redirect('/authorize_user');
});

app.listen(port, function () {
  console.log('App listening on port 3000!')
});


const TIMES_MAP = {
        "00": "12 am",
        "01": "1 am",
        "02": "2 am",
        "03": 60,
        "04": 40,
        "05": 80,
        "06": 60,
        "07": 20,
        "08": 10,
        "09": 0,
        "10": 0,
        "11": 10,
        "12": 15,
        "13": 30,
        "14": 60,
        "15": 10,
        "16": 40,
        "17": 10,
        "18": 5,
        "19": 3,
        "20": 0,
        "21": 3,
        "22": 10,
        "23": 8

}

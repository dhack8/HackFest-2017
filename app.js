var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();


api.use({
  client_id: '2baab622a9d44a9d962742f3ba2ae74d',
  client_secret: 'd5145e8c983745f0bef2263a20f9d9bc'
});

app.set("view engine", "ejs");

var redirect_uri = 'http://127.0.0.1:3000/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      api.use({
        access_token: result.access_token
      });

      api.user_self_media_recent(function(err, medias, pagination, remaining, limit) {
        console.log(err);
        console.log(medias);
        console.log(medias[0].id);
        console.log(medias[0].user.id);
        console.log(pagination);
        console.log(remaining);
        console.log(limit);

        var variables = {medias};
        res.render("index.html.ejs", variables);
      });
      
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

app.get('/', function(req, res) {
  res.redirect('/authorize_user');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


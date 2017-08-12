var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();

app.configure(function() {
	
});

api.use({client_id: '',
		client_secret: ''});

var redirect_uri = '';

exports.authorize_user = function(req,res) {
	res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state'}));
};

exports.handleauth = function(req, res) {
	api.authorize_user(req.query.code, redirect_uri, function(err, result) {
		if (err) {
			console.log(err.body);
			res.send("Fail");
		else {
			console.log('Access Token: ' + result.access_token);
			res.send("Hello!");
		}
	});
};

app.get('authorize_user', exports.authorize_user);
app.get('/handleauth', exports.handleauth);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

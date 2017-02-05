// Server setup
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// App setup
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');
app.use(favicon(process.cwd() + "/Public/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'Public')));

// Start listening
server.listen(Number(process.env.PORT || "5000"), function() {
	
	console.log("Listening...");
});

// Mount the routers.
app.use('/', function(req, res) {
    
    res.redirect("/index.html");
});

// Catch 404 and render the 404 page
app.use(function(req, res, next){
	
	res.status(404);
	
	// Respond with html page
	if (req.accepts('html'))
	{
		res.send('Not found: '+req.protocol +'://'+req.get('host')+req.baseUrl+req.url);
		return;
	}
	
	// Respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found', url: req.protocol +'://'+req.get('host')+req.baseUrl+req.url });
		return;
	}
	
	// Default to plain-text. send()
	res.type('txt').send('Not found: '+req.protocol +'://'+req.get('host')+req.baseUrl+req.url);
});

/// Error handlers

// Development error handler will print stacktrace
if (app.get('env') === 'development')
{
	app.use(function(err, req, res, next)
	{
		res.status(err.status || 500);
		res.send("An error has occured. Please contact the site administrator if you would like to help resolve this issue.<br><br>"+err.message);
	});
}

// Production error handler where no stacktraces leaked to user
app.use(function(err, req, res, next)
{
	res.status(err.status || 500);
    res.send("An error has occured. Please contact the site administrator if you would like to help resolve this issue.<br><br>"+err.message);
});

module.exports = app;
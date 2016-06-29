var express = require('express'); //import express module

var app = express();

app.disable('x-powered-by'); //block our header from containing information about server - security reasons

//set up handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//More Imports Here



app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));


//app get accepts a path then function = path is usually root directory
app.get('/',function(req,res){ //when port 3000 is requested send back this
	res.render('home');

});


app.use(function(req,res,next){
	console.log("Looking for URL:" + req.url);
	next();
});


app.get('/junk',function(req,res,next)
{
	console.log("Tried to access the /junk");
	throw new Error('junk does\'t exit');
});

app.use(function(err,req,res,next){
	console.log('Error'+ err.message);
	next();
});

//app get accepts a path then function = path is usually root directory
app.get('/about',function(req,res){ //when port 3000 is requested send back this
	res.render('about');

});

//app use examples are examples of middleware
app.use(function(req,res){
	res.type('text/html');
	res.status(404);
	res.render('404');
});


app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){ //listen on port for instructions 
	console.log("Express started on http://localhost:"+ app.get('port') + "press Ctrl-C to terminate");
});


















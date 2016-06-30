var express = require('express'); //import express module

var app = express();

app.disable('x-powered-by'); //block our header from containing information about server - security reasons

//set up handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//More Imports Here

app.use(require('body-parser').urlencoded({
	extended: true}));


var formidable = require('formidable');
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));


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



app.get('/contact',function(req,res){
	res.render('contact',{csrf:'CSRF Token Here'});
});


app.get('/thankyou',function(req,res){
	res.render('thankyou');
});


app.post('/process',function(req,res){
	console.log('Form' + req.query.form);
	console.log('CSRF Token:' + req.body._csrf);
	console.log('Email' + req.body.email);
	console.log('Question' + req.body.ques);
	res.redirect(303,'/thankyou');
});


app.listen(app.get('port'),function(){ //listen on port for instructions 
	console.log("Express started on http://localhost:"+ app.get('port') + "press Ctrl-C to terminate");
});


app.get('/file-upload',function(req,res){
	var now = new Date();
	res.render('file-upload',{
		year: now.getFullYear(),
		month: now.getMonth()});
});


app.post('/file-upload/:year/:month',
	function(req,res){

		var form = new formidable.IncomingForm();
		form.parse(req, function(err,fields,file){
			console.log("Working...");
			if (err)
				return res.redirect(303,'/error');

			console.log('Recieved File');
			console.log(file);
			res.redirect(303,'/thankyou');
		});
	});


//setting up cookie
app.get('/cookie',function(req,res){
	res.cookie('username','Derek',{expire:new Date() + 999}).send('username has value of Derek');
});

app.get('/listcookies',function(req,res){
	console.log("Cookies:",req.cookies);
	res.send('Look in the console for cookies');
});

app.get('/deletecookie',function(req,res){
	res.clearCookie('username');
	res.send('username Cookie Deleted');
})




var session = require('express-session');

var parseurl = require('parseurl');

app.use(session({
	resave:false, //only want to save to session store if save has been made
	saveUnintialized: true, //store session information if new
	secret: credentials.cookieSecret,
}));

//more middleware
app.use(function(req,res,next){
	var views = req.session.views;

	if(!views){
		views = req.session.views = {};
	}
	var pathname = parseurl(req).pathname;
	views[pathname] = (views[pathname] || 0) +1;
	next();//always put next in middleware to continue down pipeline/code to finish off 
});


app.get('/viewcount',function(req,res,next){
	res.send('You view this page' + req.session.views['/viewcount'] + ' times');
});

var fs = require("fs");
app.get('/readfile',function(req,res, next){
	fs.readFile('./public/randomfile.txt',function(err,data){
		if (err){
			return console.error(err);
			}
		res.send("the File: "+ data.toString());
	})
})

app.get('/writefile',function(req,res,next){
	fs.writeFile('./public/randomfile2.txt',
		'More random text',function(err){
			if(err){
				return console.error(err);
			}
		});
	fs.readFile('./public/randomfile2.txt',
		function(err,data){
			if(err){
				return console.error(err);
			}
		res.send("The File" + data.toString());	
		});
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



















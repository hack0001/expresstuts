var express = require('express'); //import express module

var app = express();


app.set('port',process.env.PORT || 3000);

app.get('/',function(req,res){ 
	res.send('Express Works This Time');
});

app.listen(app.get('port'),function(){ //listen on port for instructions 
	console.log('Express started press Ctrl-C to terminate');
});


















var express = require('express'); //import express module

var app = express();


app.set('port',process.env.PORT || 3000);

app.get('/',function(req,res){ //when port 3000 is requested send back this
	res.send('Express Works This Time shabba');
});

app.listen(app.get('port'),function(){ //listen on port for instructions 
	console.log('Express started press Ctrl-C to terminate');
});


















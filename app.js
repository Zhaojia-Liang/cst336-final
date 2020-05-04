/* Require external APIs and start our application instance */
var express = require('express');
var app = express();
var request = require('request');

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

app.get('/account', function(req, res){
    res.render('account');
});

app.get('/reserve', function(req, res){
    res.render('reserve');
});

app.get('/cancel', function(req, res){
    res.render('cancel');
});

app.get('/management', function(req, res){
    res.render('management');
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})
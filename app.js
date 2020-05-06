/* App Configuration */
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'top secret code!',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'zhaojia',
    password: 'zhaojia',
    database: 'final_db'
});
connection.connect();

/* Middleware */
function isAuthenticated(req, res, next){
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}

function checkUsername(username){
    let stmt = 'SELECT * FROM users WHERE username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [username], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}

function checkPassword(password, hash){
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hash, function(error, result){
          if(error) throw error;
          resolve(result);
       }); 
    });
}

/* Home Route */
app.get('/', function(req, res){
    res.render('home');
});

var id = null;

app.get('/HOME', isAuthenticated, function(req, res) {
    var stmt = 'SELECT * FROM users;';
    // console.log(stmt);
    connection.query(stmt, function(error, results){
        if(error) throw error;
        // console.log(results);
        results.forEach(function(user){
            // console.log(user.username + " ");
            if(user.username == req.session.user) id = user.userId;
        });
        console.log(id);
        res.render('HOME', {user: req.session.user});
    });
});

/* Logout Route */
app.get('/logout', function(req, res){
   req.session.destroy();
   id = null;
   res.redirect('/');
});

/* Create Account Routes */
app.get('/account', function(req, res){
    res.render('account');
});

/* Login Routes */
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', async function(req, res){
    let isUserExist   = await checkUsername(req.body.username);
    let hashedPasswd  = isUserExist.length > 0 ? isUserExist[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPasswd);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = isUserExist[0].username;
        res.redirect('/HOME');
    }
    else{
        res.render('login', {error: true});
    }
});

/* Register Routes */
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    let salt = 10;
    bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        let stmt = 'INSERT INTO users (username, password) VALUES (?, ?)';
        let data = [req.body.username, hash];
        connection.query(stmt, data, function(error, result){
           if(error) throw error;
           res.redirect('/login');
        });
    });
});

app.get('/reserve', function(req, res){
    var stmt = 'SELECT flightnumber FROM users where userId = ' + id + ' ;';
    // console.log(stmt);
    connection.query(stmt, function(error, results){
        if(error) throw error;
        var flightinfo = results[0];
        res.render('reserve', {flight : flightinfo});
    });
    // res.render('reserve');
});

app.get('/flight', function(req, res) {
    var start = req.query.start;
    var end = req.query.end;
    console.log(start + " " + end);
    var stmt = 'SELECT * from flight where start=\''+ start + '\' and end=\'' + end + '\' ;';
    console.log(stmt);
    connection.query(stmt, function(error, found){
      if(error) throw error;
      if(found.length){
          console.log(found);
          var flight = found[0];
          res.render('flight', {flight: flight});
      }else{
          res.render('Noflight');
      }
    });
    // res.render('flight');
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
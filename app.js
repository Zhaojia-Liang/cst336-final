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
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b94f6dec9424ad',
    password: 'd032f167',
    database: 'heroku_8f57d5c6d1b896b'
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

function checkManagername(username){
    let stmt = 'SELECT * FROM manager WHERE name=?';
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

var id = null;

var fn = "";

/* Home Route */
app.get('/', function(req, res){
    res.render('home');
});

/* User Page Route */
app.get('/HOME', isAuthenticated, function(req, res) {
    var stmt = 'SELECT * FROM users;';
    // console.log(stmt);
    connection.query(stmt, function(error, results){
        if(error) throw error;
        // console.log(results);
        results.forEach(function(user){
            // console.log(user.username + " ");
            if(user.username == req.session.user){
                id = user.userId;
                fn = user.flightnumber;
            }
        });
        console.log(id);
        res.render('HOME', {user: req.session.user});
    });
});

/* Create Account Route */
app.get('/account', function(req, res){
    res.render('account');
});

/* Register Route */
app.get('/register', function(req, res){
    res.render('register');
});

/* Register Route - Fetching data into the database */
app.post('/register', function(req, res){
    let salt = 10;
    bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        let stmt = 'INSERT INTO users (username, password, flightnumber) VALUES (?, ?, ?)';
        let data = [req.body.username, hash, ""];
        connection.query(stmt, data, function(error, result){
           if(error) throw error;
           res.redirect('/login');
        });
    });
});

/* Login Route */
app.get('/login', function(req, res){
    res.render('login');
});

/* Check Login Route */
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

/* Logout Route */
app.get('/logout', isAuthenticated, function(req, res){
   req.session.destroy();
   id = null;
   res.redirect('/');
});

/* Reserve Route */
app.get('/reserve', isAuthenticated, function(req, res){
    var stmt = 'SELECT * FROM users where userId = ' + id + ' ;';
    // console.log(stmt);
    connection.query(stmt, function(error, results){
        if(error) throw error;
        var flightinfo = results[0];
        console.log(flightinfo);
        res.render('reserve', {flight : flightinfo});
    });
    // res.render('reserve');
});

/* Reserve Route - Searching for avaliable flight in database */
app.get('/book', isAuthenticated, function(req, res) {
    var start = req.query.start;
    var end = req.query.end;
    console.log(start + " " + end);
    var stmt = 'SELECT * from flight where start=\''+ start + '\' and end=\'' + end + '\' ;';
    // console.log(stmt);
    connection.query(stmt, function(error, found){
      if(error) throw error;
      if(found.length){
          console.log(found);
          var flight = found[0];
          res.render('book', {flight: flight});
      }else{
          res.render('noresult');
      }
    });
    // res.render('flight');
});

/* Reserve Route - Booking the ticket */
app.get('/book/:fid/edit', isAuthenticated, function(req, res) {
    var stmt = 'SELECT * FROM users WHERE userId=' + id + ';';
    console.log(stmt);
    var flightid = req.params.fid;
    console.log(flightid);
    connection.query(stmt, function(error, results){
      if(error) throw error;
      console.log(results);
      if(results[0].flightnumber.length){
          res.render('twice');
      }else if(results.length){
          res.render('book_edit', {flight: flightid});
      }
    });
});

/* Reserve Route - Fetching data into the database */
app.put('/book/:fid', isAuthenticated, function(req, res){
    var stmt1 = 'UPDATE users SET ' +
                'flightnumber = "'+ req.params.fid + '"' +
                'WHERE userId = ' + id + ";";
    console.log(stmt1);
    fn = req.params.fid;
    connection.query(stmt1, function(error, results) {
        if(error) throw error;
        res.redirect('/reserve');
    });
});

/* Reserve Route - Check the booking infomation */
app.get('/status/:flightnumber', isAuthenticated, function(req, res, next) {
    var stmt = 'SELECT * FROM flight WHERE flightnumber="' + req.params.flightnumber + '";';
    console.log(stmt);
    connection.query(stmt, function(error, results) {
        if(error) throw error;
        var info = results[0];
        console.log(results[0]);
        res.render('status', {flight : info});
    });
});

/* Reserve Route - Cannot book the second ticket */
app.get('/twice', isAuthenticated, function(req, res, next) {
    res.render('twice');
});

/* Reserve Route - Ajax searching weather */
app.get('/weather', isAuthenticated, function(req, res) {
    res.render('weather');
});

/* Cancel Route */
app.get('/cancel', isAuthenticated, function(req, res){
    if(fn != null && fn != ""){
        var stmt = 'SELECT * FROM flight WHERE flightnumber="' + fn + '";';
        connection.query(stmt, function(error, results) {
            if(error) throw error;
            var info = results[0];
            res.render('cancel', {flight: info});
        });
    }else{
        console.log(fn);
        res.render('nothing');
    }
    // res.render('cancel');
});

/* Cancel Route - Have Booking status and want to cancel */
app.get('/cancel/:fnb', isAuthenticated, function(req, res) {
    var flightnumber = req.params.fnb;
    res.render('cancel_confirm', {fnb : flightnumber});
});

/* Cancel Route - Edit user's data */
app.put('/cancel/confirm/:fnb', isAuthenticated, function(req, res){
    var stmt1 = 'UPDATE users SET ' +
                'flightnumber = ""' +
                'WHERE userId = ' + id + ";";
    fn = null;
    console.log(stmt1);
    connection.query(stmt1, function(error, results) {
        if(error) throw error;
        res.redirect('/cancel');
    });
});

/* Management Route - Admin Login */
app.get('/managerLogin', function(req, res){
    res.render('managerLogin');
});

/* Management Route - Check the admin account */
app.post('/managerLogin', async function(req, res) {
    let isManagerExist   = await checkManagername(req.body.username);
    console.log(isManagerExist);
    let Passwd  = isManagerExist.length > 0 ? isManagerExist[0].password : '';
    var passwordMatch = Boolean(req.body.password == Passwd);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = isManagerExist[0].username;
        res.redirect('/management');
    }
    else{
        res.render('managerLogin', {error: true});
    }
});

/* Management Route */
app.get('/management', function(req, res){
    var stmt = 'SELECT * FROM flight;';
    console.log(stmt);
    var flight = null;
    connection.query(stmt, function(error, results){
        if(error) throw error;
        if(results.length) flight = results;
        res.render('management', {flight: flight, user: req.session.user});
    });
});

/* Management Route - Display a flight information detail */
app.get('/flightInfo/:fid', function(req, res){
    var stmt = 'SELECT * FROM flight WHERE flightId=' + req.params.fid + ';';
    console.log(stmt);
    connection.query(stmt, function(error, results){
       if(error) throw error;
       if(results.length){
           var flight = results[0];
        //   flight.departure = flight.departure.toString().split(' ').slice(0,4).join(' ');
        //   flight.arrvial = flight.arrvial.toString().split(' ').slice(0,4).join(' ');
           res.render('flightInfo', {flight: flight});
       }
    });
});

/* Management Route - Create a new flight */
app.get('/flight/new', function(req, res){
    res.render('flight_new');
});

/* Management Route - Fetching data into the database */
app.post('/flight/new', function(req, res){
   //console.log(req.body);
   connection.query('SELECT * FROM flight;', function(error, result){
       if(error) throw error;
       if(result.length){
            var flightId = result[result.length - 1].flightId + 1;
            var stmt = 'INSERT INTO flight ' +
                      '(`flightId`, `flightnumber`, `start`, `end`, `departure`, `arrival`) ' + 'VALUES' +
                      '(' + 
                       flightId + ',"' +
                       req.body.flightnumber + '","' +
                       req.body.from + '","' +
                       req.body.to + '","' +
                       req.body.departureDate + '","' +
                       req.body.arrivalDate + '"' + ');';
            console.log(stmt);
            connection.query(stmt, function(error, result){
                if(error) throw error;
                res.redirect('/management');
            });
        }
   });
});

/* Management Route - Delete user's data in the database */
app.get('/flightInfo/:fid/confirmdelete', function(req, res){
    var stmt = 'SELECT * FROM flight WHERE flightId=' + req.params.fid + ';';
    connection.query(stmt, function(error, results){
       if(error) throw error;
       if(results.length){
           var flight = results[0];
           res.render('flight_delete', {flight: flight});
       }
    });
});

/* Management Route - Delete data */
app.get('/flightInfo/:fid/delete', function(req, res){
    var stmt = 'DELETE from flight WHERE flightId='+ req.params.fid + ';';
    connection.query(stmt, function(error, result){
        if(error) throw error;
        res.redirect('/management');
    });
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})
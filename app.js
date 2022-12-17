var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

var app = express();
app.use(cors());
/** for post */
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var allRouter= require('./routes/all');
var pieRouter= require('./routes/pie');
var dashboardRouter = require('./routes/dasboard');

//auth with JWT
app.post("/user/generateToken", (req, res) => {
  // Validiamo prima l'utente
  console.table(req.body)
  // Generiamo il JWT Token SE L'UTENTE è AUTENTICATO
  // ovviamente l'id dell'utente va messo quello reale

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  };

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: 60 });

  res.send(token);
});

app.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in the header of
  // the request
  // Due to security reasons.

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  console.log(tokenHeaderKey);

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    console.log(error)
    console.log("2");
    return res.status(401).send(error);
  }
});


// view engine setup
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/all', allRouter);
app.use('/pie', pieRouter);
app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(3001, ()=>{ console.log('Avvio...')});

module.exports = app;

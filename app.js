var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { validateUser } = require("./crud/Crud");

var app = express();
app.use(cors());
/** for post */
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var allRouter = require("./routes/all");
var pieRouter = require("./routes/pie");
var dashboardRouter = require("./routes/dasboard");
var contactsRouter = require("./routes/contacts");
var linechartRouter = require("./routes/lineChart");
;
//_____AUTENTICAZIONE DELLE  CREDENZIALI PER IL LOGIN________//
app.post("/user/generateToken", async (req, res) => {
  console.table(req.body);
  try {
    let auth = await validateUser(req, res, req.body.username, req.body.pwd);

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: 12,
    };

    if (auth.auth) {
      const token = jwt.sign(data, jwtSecretKey, { expiresIn: 16 });
      res.send(token);
    } else {
      console.log(auth.error);
      res.status(401).send(auth.error);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});

//_______AUTENTICAZIONE STANDARD______//
app.get("/user/validateToken", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      res.send("Successfully Verified");
    } else {
      res.status(401).send(error);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
});
//__________________________________________//

//________RESTART DEL TOKEN_________//
app.get("/user/restartToken", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
 try {
   const token = req.header(tokenHeaderKey);
   //const verified = jwt.verify(token, jwtSecretKey);
   if (true) {
     let data = {
       time: Date(),
       userId: 12,
     };
     console.log("____________________VERIFICATO______________________")
     res.send(jwt.sign(data, jwtSecretKey, { expiresIn: 16 }));
   } else {
     res.status(401).send(error);
   }
 } catch (error) {
   console.log(error);
   res.status(401).send(error);
 }
});
//__________________________________//

// view engine setup
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/all", allRouter);
app.use("/pie", pieRouter);
app.use("/dashboard", dashboardRouter);
app.use("/contacts", contactsRouter);
app.use("/linechart", linechartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3001, () => {
  console.log("Avvio...");
});

module.exports = app;

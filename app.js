const express = require('express');
const session = require("express-session");
const createError = require('http-errors');
const path = require('path');
const passport = require("passport");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config()
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const authRouter = require('./routes/authentication');


//#########################################################################################
//                                    MONGO CONNECTION 
//#########################################################################################

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection

// Set up mongoose connection
const dev_db_url =
  "mongodb+srv://your_user_name:your_password@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGO_MEMBERSONLY_URL || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//#########################################################################################
//#########################################################################################

//#########################################################################################
//                                    PASSPORT CONFIGURATION
//#########################################################################################
passport.use(
  new LocalStrategy( async (username, password, done) => {
    try{
      const user = await User.findOne({ username: username });
      if (!user) {
          return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
              // passwords match! log user in
              return done(null, user)
          } else {
              // passwords do not match!

              return done(null, false, { message: "Incorrect password" })
          }
      })
    }catch(err){
      return done(err);
      }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser( async function(id, done) {

  try{

      const user = await User.findById(id).exec();
      console.log(user);
      done(null, user);
  }catch(err){
      done(err);
  }
});

//#########################################################################################
//#########################################################################################
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  // console.log(req.user);
  // res.send({session: req.session});
  res.send({user:req.user});

});
app.use('/users', usersRouter);

app.post(
  "/auth/login", 
    passport.authenticate("local"),
    (req, res) => {

      res.send({message:"login success", user:req.user});
    }

);

app.post("/auth/sign-up", async (req, res, next) => {

  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
        return next(err);
    }
    try{
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        })
        .save();    
        res.send({message:"sign-up success"});      
    }catch(err){

        console.log(err);
    }
  });
});


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

module.exports = app;

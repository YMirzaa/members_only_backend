const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");


exports.login = async function (req, res, next) {
    try{
        passport.authenticate("local");

        res.send({message:"login success", user: req.body });
    }
    catch(err){
        console.log(err);
    }
};

exports.sign_up = async function (req, res, next) {
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
};
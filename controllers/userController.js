const User = require("../models/user");
// const async = require("async");

// const { body, validationResult } = require("express-validator");

// Display list of all Users.
exports.user_list = async function (req, res, next) {
    try{
        let users = await User.find({});
        console.log(users);
        return next();
    }
    catch(err){
        console.log(err);
        return next(err);
    }
};
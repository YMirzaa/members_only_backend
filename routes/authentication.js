var express = require('express');
var router = express.Router();

const authentication_controller = require("../controllers/authenticationController");

/* GET users listing. */
router.post('/login', authentication_controller.login);
router.post('/sign-up', authentication_controller.sign_up);

module.exports = router;



const express = require('express');
const multer = require('multer');
const router = express.Router();


// middlewares and validation
const { validateSignUp, validateLogIn } = require('../validations/userValidation');
const checkUserExists = require('../middlewares/checkUserExists');

var mainController = require("../controller/main");


router.get('/', mainController.home);
router.get('/dashboard', mainController.dashboard);


module.exports =  router;
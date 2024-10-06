const express = require('express');
const multer = require('multer');
const router = express.Router();


// middlewares and validation
const { validateSignUp, validateLogIn } = require('../validations/userValidation');
const checkUserExists = require('../middlewares/checkUserExists');

var authSessionController = require("../controller/authSession");
var registerUserController = require("../controller/registerUser");

module.exports = function (BASE_PATH) {
    // Sign up middleware array
    const signUpMiddleware = [
        validateSignUp,
        checkUserExists
    ];


    // Routes



    router.get('/signup', registerUserController.create);

    router.post('/signup', signUpMiddleware, registerUserController.post);

    router.get('/signin', authSessionController.create);

    router.post('/signin', validateLogIn, authSessionController.post);

    router.get('/forgotpassword', registerUserController.forgotpassword);

    return router;
};

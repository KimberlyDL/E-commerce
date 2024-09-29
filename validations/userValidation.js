const { check, body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/errorHandler');

// Validation for Sign Up
const validateSignUp = [
    check('firstName').notEmpty().withMessage('First name should not be blank'),
    check('lastName').notEmpty().withMessage('Last name should not be blank'),
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleValidationErrors
];

// Validation for Log In
const validateLogIn = [
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

module.exports = {
    validateSignUp,
    validateLogIn
};

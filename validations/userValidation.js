const { check, body, validationResult } = require('express-validator');

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

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();  // Extract errors array
            const formData = req.body;

            return res.render('user/register', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: errorsArray.length > 0 ? errorsArray : null,  // Correct reference to `errorsArray`
                formData: formData
            });
        }

        next();  // Proceed to the next middleware if no errors
    }
];

const validateFullRegistration = [ 
    check('firstName').notEmpty().withMessage('First name should not be blank'),
    check('lastName').notEmpty().withMessage('Last name should not be blank'),    // Username validation: not empty and minimum 3 characters
    check('username').notEmpty().withMessage('Username should not be blank')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),    // Email validation: must be a valid email
    check('email').isEmail().withMessage('Must be a valid email'),    // Phone validation: must be numeric and between 10 and 15 characters
    check('phone').isMobilePhone().withMessage('Must be a valid phone number'),    // Address validation: not empty and minimum 10 characters
    check('address').notEmpty().withMessage('Address should not be blank')
        .isLength({ min: 10 }).withMessage('Address must be at least 10 characters long'),    // Password validation: minimum 6 characters
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),    // Confirm password validation: must match with `password` field
    body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),

    // Middleware to handle validation errors
    (req, res, next) => {

        console.log("Form Data Received: ", req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();  // Extract errors array
            const formData = req.body;  // Preserve form data to pre-fill the form

            return res.render('admin/user/addUser', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: errorsArray.length > 0 ? errorsArray : null,  // Send the errors array if there are errors
                formData: formData  // Pre-fill the form with submitted data
            });
        }

        next();  // Proceed to the next middleware if no errors
    }
];

const validateEdit = [ 
    check('firstName').notEmpty().withMessage('First name should not be blank'),
    check('lastName').notEmpty().withMessage('Last name should not be blank'),    // Username validation: not empty and minimum 3 characters
    check('username').notEmpty().withMessage('Username should not be blank')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),    // Email validation: must be a valid email
    check('phone').isMobilePhone().withMessage('Must be a valid phone number'),    // Address validation: not empty and minimum 10 characters
    check('address').notEmpty().withMessage('Address should not be blank')
        .isLength({ min: 10 }).withMessage('Address must be at least 10 characters long'),    // Password validation: minimum 6 characters


    (req, res, next) => {

        console.log("Form Data Received: ", req.body);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();  // Extract errors array
            const formData = req.body;  // Preserve form data to pre-fill the form

            return res.render('admin/user/editUser', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: errorsArray.length > 0 ? errorsArray : null,  // Send the errors array if there are errors
                formData: formData  // Pre-fill the form with submitted data
            });
        }

        next();  // Proceed to the next middleware if no errors
    }
];

// Validation for Log In
const validateLogIn = [
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();  // Extract errors array
            const formData = req.body;

            return res.render('user/signin', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: errorsArray.length > 0 ? errorsArray : [],  // Correct reference to `errorsArray`
                formData: formData
            });
        }

        next();  // Proceed to the next middleware if no errors
    }
];

module.exports = {
    validateFullRegistration,
    validateSignUp,
    validateLogIn,
    validateEdit
};

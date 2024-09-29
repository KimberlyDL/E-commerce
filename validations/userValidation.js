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
                errors: errorsArray.length > 0 ? errorsArray : null,  // Correct reference to `errorsArray`
                formData: formData
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
                errors: errorsArray.length > 0 ? errorsArray : [],  // Correct reference to `errorsArray`
                formData: formData
            });
        }

        next();  // Proceed to the next middleware if no errors
    }
];

module.exports = {
    validateSignUp,
    validateLogIn
};

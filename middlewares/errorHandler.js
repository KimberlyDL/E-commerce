const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('formData', req.body);

        const Errors = req.flash('errors');
        const formData = req.flash('formData')[0];
        
        res.render('user/register', {
            title: 'Sign Up - Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
            session: req.session || {},
            errors: Errors.length > 0 ? errors : null, // Pass errors if they exist
            formData: formData
        });
    }
    next();
};

module.exports = {
    handleValidationErrors
};
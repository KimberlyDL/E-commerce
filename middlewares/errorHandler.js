const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('formData', req.body);
        return res.redirect('back');
    }
    next();
};

module.exports = {
    handleValidationErrors
};
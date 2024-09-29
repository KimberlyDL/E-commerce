const {User} = require('../models');

const checkUserExists = (req, res, next) => {
    const email = req.body.email;
    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                req.flash('errors', [{ msg: 'Email already taken' }]);
                req.flash('formData', req.body);
                return res.redirect('back');
            }
            next();
        })
        .catch(err => next(err));
};

module.exports = checkUserExists;
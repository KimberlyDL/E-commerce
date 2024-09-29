const { User } = require('../models');

const checkUserExists = (req, res, next) => {

    const email = req.body.email;

    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                const formData = req.body;

                res.render('user/register', {
                    title: 'Supreme Agribet Feeds Supply Store',
                    currentUrl: req.url,
                    errors: ['Email already taken'], // Pass errors if they exist
                    formData: formData
                });
            }
            next();
        })
        .catch(err => next(err));
};

module.exports = checkUserExists;
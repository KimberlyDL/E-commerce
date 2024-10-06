const { User } = require('../models');

const checkUserExists = (req, res, next) => {

    const email = req.body.email;

    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                const formData = req.body;

                return res.render('admin/user/addUser', {
                    title: 'Supreme Agribet Feeds Supply Store',
                    currentUrl: req.url,
                    session: req.session || {},
                    errors: ['Email already taken'], // Pass errors if they exist
                    formData: formData
                });
            }
            next();
        })
        .catch(err => next(err));
};

module.exports = checkUserExists;
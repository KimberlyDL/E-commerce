const fs = require('fs');
const path = require('path');
const { Product, Cart, ProductCategory, ProductCategoryProduct, User, Review } = require('../models');


const mainController = {

    home: (req, res) => {
        res.render('home', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    },

    dashboard: async (req, res) => {
        bcrypt.hash(req.body.password, saltRounds)
            .then(hashedPassword => {
                const user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword
                };

                User.create(user).then(data => {
                    res.redirect('/signin');
                }).catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            });
    },

}


module.exports = mainController;
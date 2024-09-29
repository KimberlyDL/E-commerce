const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review } = require('../models');


const registerUserController = {


    create: async (req, res) => {
        res.render('user/register', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    },

    post: async (req, res) => {
        bcrypt.hash(req.body.password, saltRounds)
            .then(hashedPassword => {
                const user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword,
                    
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

    forgotpassword: async (req, res) => {
        res.render('user/forgotpassword', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    }
}


module.exports = registerUserController;
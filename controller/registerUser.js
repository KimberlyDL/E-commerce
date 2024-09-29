const express = require('express');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const saltRounds = 10;
const router = express.Router();
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review } = require('../models');


const registerUserController = {


    create: async (req, res) => {
        // Retrieve the flash messages
        const errors = req.flash('errors');
        const formData = req.flash('formData');

        res.render('user/register', {
            title: 'Sign Up - Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
            errors: errors.length > 0 ? errors : null, // Pass errors if they exist
            formData: formData
        });
    },

    post: async (req, res) => {
        const { firstName, lastName, email } = req.body;

        bcrypt.hash(req.body.password, saltRounds)
            .then(hashedPassword => {
                const user = {
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
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
const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { Product, User, Cart, ProductCategory, ProductCategoryProduct, Review } = require('../models');


const authSessionController = {

    create: async (req, res) => {
        res.render('user/signin', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    },

    checkUserExists: async (userEmail) => {
        const user = await User.findOne({ where: { email: userEmail } });
        return user !== null ? user : false;
    },

    post: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email: email } });

            console.log(user);

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    req.session.Id = user.id;
                    req.session.firstName = user.firstName;
                    req.session.lastName = user.lastName;
                    return res.redirect('/');
                }
            }

            return res.render('user/signin', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                errors: 'Invalid log in',
                formData: { email }
            });

        } catch (error) {
            console.error("Error during login:", error);
            return res.render('user/signin', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                errors: 'An error occurred, please try again later.',
                formData: { email }
            });
        }
    }
}
module.exports = authSessionController;

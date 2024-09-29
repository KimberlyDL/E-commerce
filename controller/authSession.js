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
            const userModel = await checkUserExists(email);

            if (userModel) {
                const isMatch = await bcrypt.compare(password, userModel.password);
                if (isMatch) {
                    req.session.Id = userModel.id;
                    req.session.firstName = userModel.firstName;
                    req.session.lastName = userModel.lastName;
                    return res.redirect('/dashboard');
                }
            }

            return res.render('user/signin', {
                errors: 'Invalid log in',
                formData: { email }
            });

        } catch (error) {
            console.error("Error during login:", error);
            return res.render('user/signin', {
                errors: 'An error occurred, please try again later.',
                formData: { email }
            });
        }
    }

}
module.exports = authSessionController;

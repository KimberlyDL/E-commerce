const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const { Product, User, Cart, ProductCategory, ProductCategoryProduct } = require('../models');

const authSessionController = {

    create: async (req, res) => {
        res.render('user/signin', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
            session: req.session || {},
        })
    },

    checkUserExists: async (userEmail) => {
        const user = await User.findOne({ where: { email: userEmail } });
        return user !== null ? user : false;
    },

    post: async (req, res) => {
        const { email, password } = req.body;

        try {
            // const user = await User.findOne({ where: { email: email } });

            const user = await authSessionController.checkUserExists(email);

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    userId = user.id;
    
                    const cartCount = await Cart.count({
                        where: { userId }
                    });
    
                    req.session.userId = userId;
                    req.session.firstName = user.firstName;
                    req.session.lastName = user.lastName;
                    req.session.role = user.role;
                    req.session.cartCount = cartCount;
                    return res.redirect('/');
                }
            }

            res.render('user/signin', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: {msg: 'Invalid log in'},
                formData: { email },

            });

        } catch (error) {
            console.error("Error during login:", error);
            return res.render('user/signin', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                errors: {msg: 'An error occurred, please try again later.'},
                formData: { email }
            });
        }
    },

    destroy: async (req, res) => {
        // Destroy the session to log the user out
        req.session.destroy((err) => {
            if (err) {
                console.error("Failed to destroy session during logout", err);
                return res.status(500).send('Something went wrong. Please try again.');
            }
    
            // Redirect the user to the login page or home page after logout
            res.redirect('/signin');
        });
    }
}
module.exports = authSessionController;

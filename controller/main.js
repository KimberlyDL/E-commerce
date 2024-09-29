const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Product, Cart, ProductCategory, ProductCategoryProduct, User, Review } = require('../models');


const mainController = {

    home: (req, res) => {
        res.render('home', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    },

    dashboard: async (req, res) => {
        res.render('home', {
            title: 'Supreme Agribet Feeds Supply Store',
            currentUrl: req.url,
        })
    },

}


module.exports = mainController;
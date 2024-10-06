const fs = require('fs');
const path = require('path');
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review, Checkout, CheckoutItem } = require('../../models');

const dashboardController = {

  index: async (req, res) => {
    try {
      res.render('dashboard', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  viewOrders: async (req, res) => {
    try {
      // Fetch all checkouts including the related User who placed the order
      const checkouts = await Checkout.findAll({
        order: [['createdAt', 'DESC']],  // Order by most recent first
        include: {
          model: User,  // Include the User model
          attributes: ['username', 'email', 'firstname', 'lastname']  // Fetch user details
        }
      });
  
      res.render('userCheckouts', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
        checkouts  // Pass the checkout records (including user info) to the view
      });
    } catch (error) {
      console.error('Error fetching checkouts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getCheckoutDetails: async (req, res) => {
    try {
      const checkoutId = req.params.id;
  
      // Fetch the checkout details, including the user who placed the order
      const checkout = await Checkout.findOne({
        where: { id: checkoutId },
        include: {
          model: User,
          attributes: ['username', 'email', 'firstname', 'lastname']  // Include user details
        }
      });
  
      if (!checkout) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Fetch all items for this checkout
      const checkoutItems = await CheckoutItem.findAll({
        where: { checkoutId: checkout.id },
        include: Product  // Include the product details in each checkout item
      });
  
      res.json({
        checkout,
        checkoutItems
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = dashboardController;

const fs = require('fs');
const path = require('path');
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review, Checkout, CheckoutItem } = require('../../models');

const { Op } = require('sequelize'); // Import Op for querying date ranges

const dashboardController = {
  index: async (req, res) => {
    try {
      const { range } = req.query; // Get the date range from the query string
      let whereCondition = { paymentStatus: 'paid' };

      // Set the date range condition based on the selected range
      if (range === 'day') {
        whereCondition.completedAt = { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) }; // Today
      } else if (range === 'week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of this week
        whereCondition.completedAt = { [Op.gte]: startOfWeek };
      } else if (range === 'month') {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Start of this month
        whereCondition.completedAt = { [Op.gte]: startOfMonth };
      } else if (range === 'year') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); // Start of this year
        whereCondition.completedAt = { [Op.gte]: startOfYear };
      }

      // Fetch the total number of completed orders (paid orders) for the specified range
      const totalOrders = await Checkout.count({
        where: whereCondition,
      });

      // Fetch the total sales (sum of all 'totalAmount' from paid checkouts) for the specified range
      const totalSales = await Checkout.sum('totalAmount', {
        where: whereCondition,
      });

      // Fetch the number of new customers registered in the last month
      const newCustomers = await User.count({
        where: {
          createdAt: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } // Users created in the last 30 days
        }
      });

      // Fetch all products from the database
      const products = await Product.findAll(); // Add this line to fetch products

      // Render the dashboard and pass the totalOrders, totalSales, newCustomers, and products
      res.render('dashboard', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
        totalOrders,
        totalSales,
        newCustomers, // Pass the new customers to the view
        products, // Pass the products to the view
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

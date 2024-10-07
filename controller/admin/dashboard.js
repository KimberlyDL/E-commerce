const { Op } = require('sequelize'); // Import Op for querying date ranges
const { Checkout, User, Product } = require('../../models'); // Import User and Product models

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
  
};

module.exports = dashboardController;

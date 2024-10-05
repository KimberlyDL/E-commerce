const salesController = {

  index: async (req, res) => {
    try {
      res.render('dashboard', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = salesController;

const cartController = {
    index: async (req, res) => {
        try {
            res.render('cart', {
                title: 'Supreme Agrivet Feeds Supply Store',
                currentUrl: req.url,
                // session: req.session || {},
                // cartCount,
            });

        } catch (error) {
            console.error('Error fetching cart count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = cartController;

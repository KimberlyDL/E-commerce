const { Product, Cart } = require('../models');

const cartController = {
    index: async (req, res) => {
        try {
            const id = req.session.userId;
            const products = await Product.findall({
                where: { id: id },
                as: 'products',
            })

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

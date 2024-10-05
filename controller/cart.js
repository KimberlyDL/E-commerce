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
    checkout: async (req, res) => {
        try {
            const id = req.session.userId; 

            const checkoutData = await Checkout.findOne({
                where: { id: id }, // Example checkout ID
                include: [
                    {
                        model: Cart,
                        include: [
                            {
                                model: Product,
                                attributes: ['name', 'price', 'description', 'images']
                            }
                        ]
                    },
                    {
                        model: User,
                        attributes: ['name', 'email']
                    }
                ]
            });

            res.render('checkout', {
                title: 'Supreme Agrivet Feeds Supply Store',
                currentUrl: req.url,
                // session: req.session || {},
                checkoutData,
            });
        } catch (error) {
            console.error('Error fetching cart count:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    }
};

module.exports = cartController;

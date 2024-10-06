const fs = require('fs');
const path = require('path');
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review, Checkout, CheckoutItem } = require('../models');

const cartController = {
    index: async (req, res) => {
        try {
            const userId = req.session.userId;

            // Fetch all cart items for the user, including product details
            const cartItems = await Cart.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Product,
                        attributes: ['name', 'price', 'description', 'images']
                    }
                ]
            });
            const user = await User.findOne({
                where: { id: userId }
            });

            //res.json(cartItems).send();

            res.render('cart', {
                title: 'Your Shopping Cart',
                currentUrl: req.url,
                session: req.session || {},
                cartItems, // Pass the cart items to the view
                user,
            });

        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    completeOrder: async (req, res) => {
        try {
            const { paymentMethod } = req.body;  // Payment method from user
            const userId = req.session.userId;   // Get the logged-in user ID

            // Fetch all cart items for the user
            const cartItems = await Cart.findAll({
                where: { userId: userId },
                include: Product  // Include product details for cart
            });

            if (!cartItems.length) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            // Calculate total price
            let totalAmount = cartItems.reduce((sum, item) => {
                return sum + item.quantity * item.Product.price;
            }, 0);

            const referenceNumber = generateOrderReference();

            // Create a new Checkout entry
            const checkout = await Checkout.create({
                userId: userId,
                totalAmount: totalAmount,
                paymentStatus: 'paid',
                paymentMethod: paymentMethod,
                referenceNumber: referenceNumber,
                completedAt: new Date(),  // Set once payment is completed
            });

            // Link cart items to the checkout
            const checkoutItemsPromises = cartItems.map(async (item) => {
                await CheckoutItem.create({
                    checkoutId: checkout.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.Product.price
                });
            });

            await Promise.all(checkoutItemsPromises);  // Ensure all cart items are linked to the checkout

            // Clear the user's cart after checkout
            await Cart.destroy({ where: { userId: userId } });

            res.status(200).json({
                success: true,
                message: 'Thank you for your purchase!',
                referenceNumber: checkout.referenceNumber,
                checkout,
            });

        } catch (error) {
            console.error('Error completing order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    addtocart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.session.userId;

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Invalid quantity' });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            let cartItem = await Cart.findOne({
                where: {
                    userId: userId,
                    productId: productId
                }
            });

            if (cartItem) {
                cartItem.quantity += parseInt(quantity, 10);
                await cartItem.save();
            } else {
                await Cart.create({
                    userId: userId,
                    productId: productId,
                    quantity: parseInt(quantity, 10)
                });
            }

            const cartCount = await Cart.count({
                where: { userId }
            });

            res.status(200).json({
                success: true,
                message: 'Product added to cart!',
                cartCount
            });

        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateCartQuantity: async (req, res) => {
        try {
            const { itemId, newQuantity } = req.body; // Get product ID and new quantity from the request body
            const userId = req.session.userId; // Get user ID from session

            // Validate the input
            if (!Number.isInteger(parseInt(newQuantity)) || newQuantity <= 0) {
                return res.status(400).json({ success: false, message: 'Invalid quantity' });
            }

            // Find the cart item for the user
            const cartItem = await Cart.findOne({
                where: { id: itemId, userId: userId },
                include: Product // Include product details
            });

            if (!cartItem) {
                return res.status(404).json({ success: false, message: 'Cart item not found' });
            }

            // Update the quantity
            cartItem.quantity = parseInt(newQuantity);
            await cartItem.save();

            // Recalculate the total price for the cart
            const cartItems = await Cart.findAll({
                where: { userId: userId },
                include: Product  // Include product details for price calculation
            });

            const newTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);

            // Respond with success and the updated total price
            res.json({ success: true, newTotal });

        } catch (error) {
            console.error('Error updating cart quantity:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    viewOrders: async (req, res) => {
        try {
            const userId = req.session.userId;  // Get the logged-in user's ID

            // Fetch all checkouts for the logged-in user
            const checkouts = await Checkout.findAll({
                where: { userId: userId },
                order: [['createdAt', 'DESC']],  // Order by most recent first
            });

            // Render the view with the list of checkouts
            res.render('checkout', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                checkouts  // Pass the checkout records to the view
            });

        } catch (error) {
            console.error('Error fetching checkouts:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getCheckoutDetails: async (req, res) => {
        try {
          const checkoutId = req.params.id;
      
          // Fetch the checkout details
          const checkout = await Checkout.findOne({
            where: { id: checkoutId },
            include: ['User']
          });
      
          if (!checkout) {
            return res.status(404).json({ error: 'Order not found' });
          }
      
          // Fetch all items for this checkout
          const checkoutItems = await CheckoutItem.findAll({
            where: { checkoutId: checkout.id },
            include: Product  // Include the product details in each checkout item
          });
      
          // Send JSON response with the checkout and checkout items
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

module.exports = cartController;

function generateOrderReference() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase(); // Random part
    return `ORD-${date.replace(/-/g, '')}-${randomPart}`;
}

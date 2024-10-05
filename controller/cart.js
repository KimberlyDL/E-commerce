const fs = require('fs');
const path = require('path');
const { Product, ProductCategory, ProductCategoryProduct, User, Cart, Review } = require('../models');

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

            res.render('cart', {
                title: 'Your Shopping Cart',
                currentUrl: req.url,
                cartItems, // Pass the cart items to the view
            });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    checkout: async (req, res) => {
        try {
            const userId = req.session.userId;

            // Fetch all cart items for the user
            const cartItems = await Cart.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Product,
                        attributes: ['name', 'price', 'description', 'images']
                    }
                ]
            });

            // Calculate total price
            let totalAmount = 0;
            cartItems.forEach(item => {
                totalAmount += item.quantity * item.Product.price;
            });

            // Create a new Checkout entry
            const checkout = await Checkout.create({
                userId: userId,
                totalAmount: totalAmount,
                paymentStatus: 'pending',
                // Add other relevant fields like shippingCost, tax, discounts, etc.
            });

            res.render('checkout', {
                title: 'Checkout',
                currentUrl: req.url,
                cartItems,  // Pass cart items to display during checkout
                totalAmount,  // Pass total amount for display
                checkoutId: checkout.id,  // Pass checkout ID for future reference
            });
        } catch (error) {
            console.error('Error during checkout:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    },
    completeOrder: async (req, res) => {
        try {
          const { checkoutId, paymentMethod } = req.body; // Payment details from user
      
          const checkout = await Checkout.findOne({
            where: { id: checkoutId, userId: req.session.userId }
          });
      
          if (!checkout) {
            return res.status(404).json({ error: 'Checkout not found' });
          }
      
          // Update the payment status and mark the order as completed
          checkout.paymentStatus = 'paid';
          checkout.paymentMethod = paymentMethod;
          checkout.completedAt = new Date(); // Set the completed timestamp
      
          await checkout.save();
      
          // Clear the user's cart after checkout
          await Cart.destroy({ where: { userId: req.session.userId } });
      
          res.render('order-confirmation', {
            title: 'Order Confirmation',
            message: 'Thank you for your purchase!',
            checkout,  // Send checkout details to confirmation view
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
    }

};

module.exports = cartController;

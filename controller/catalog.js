const fs = require('fs');
const path = require('path');
const { Product, ProductCategory, ProductCategoryProduct, User,  Cart, Review } = require('../models');

const catalogController = {
    index: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: {
                    model: ProductCategory,
                    as: 'categories',
                    through: { attributes: [] },
                }
            });

            console.log(req.session);
            res.render('catalog', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                products
            });

        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    show: async (req, res) => {
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
    
    addtocart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const userId = req.session.userId;
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

    edit: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id, {
                include: [{ model: ProductCategory, as: 'categories' }]
            });

            const allCategories = await ProductCategory.findAll();

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.render('editProduct', {
                title: 'Supreme Agribet Feeds Supply Store',
                currentUrl: req.url,
                session: req.session || {},
                product,
                categories: allCategories
            });

        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    patch: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description, categories, customCategories, oldImage } = req.body;
            let image = oldImage;

            const product = await Product.findByPk(id, {
                include: [{ model: ProductCategory, as: 'categories' }]
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            if (req.file) {
                const filename = req.file.filename;
                image = `/uploads/product/${filename}`;

                if (oldImage) {
                    const sanitizedOldImage = oldImage.startsWith('/') ? oldImage.substring(1) : oldImage;
                    const oldImageFullPath = path.join(__dirname, '..', '..', 'public', sanitizedOldImage);
                    if (fs.existsSync(oldImageFullPath)) {
                        fs.unlinkSync(oldImageFullPath);
                    }
                }
            }

            await product.update({
                name,
                price,
                description,
                images: image,
            });

            let allCategoryIds = [];

            if (categories && Array.isArray(categories)) {
                allCategoryIds.push(...categories);
            }

            if (customCategories) {
                const customCategoryArray = customCategories.split(',').map(c => c.trim());

                for (const customCategoryName of customCategoryArray) {
                    let category = await ProductCategory.findOne({ where: { name: customCategoryName } });

                    if (!category) {
                        category = await ProductCategory.create({ name: customCategoryName });
                    }

                    allCategoryIds.push(category.id);
                }
            }

            await ProductCategoryProduct.destroy({ where: { product_id: product.id } }); // Clear old associations
            for (const categoryId of allCategoryIds) {
                await ProductCategoryProduct.create({
                    product_id: product.id,
                    category_id: categoryId
                });
            }

            res.status(200).json({ success: true, product });

        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const sanitizedOldImage = product.images.startsWith('/') ? product.images.substring(1) : product.images;
            const imagePath = path.join(__dirname, '..', '..', 'public', sanitizedOldImage);

            if (product.images && product.images !== path.join(__dirname, '..', '..', 'public', 'img/default-song.jpg')) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    } else {
                        console.log('Image deleted successfully:', imagePath);
                    }
                });
            }
            await product.destroy();
            res.redirect('/products/');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = catalogController;

const { Product, Cart, ProductCategory, ProductCategoryProduct, User, Review } = require('../../models');

const productController = {
  create: async (req, res) => {
    try {
      const categories = await ProductCategory.findAll();
      res.render('createProducts', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  post: async (req, res) => {
    try {
      const { name, price, description, categories, customCategories } = req.body;

      // if (!file) {
      //     return res.status(400).json({ message: 'No file uploaded.' });
      // }
      imagePath = '';

      if (req.file) {
        const filename = req.file.filename;
        imagePath = `/uploads/product/${filename}`;
      }

      const product = await Product.create({
        name,
        price,
        description,
        images: imagePath,
      });

      const productID = product.id;
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

      for (const categoryId of allCategoryIds) {
        await ProductCategoryProduct.create({
          product_id: productID,
          category_id: categoryId
        });
      }

      res.status(201).json({ success: true, product });

    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  index: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: {
          model: ProductCategory,
          as: 'categories', // Alias used in association
          through: { attributes: [] }, // Hides the join table attributes
        }
      });

      //res.status(201).json(products);
      res.render('products', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        products
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  edit: async (req, res) => {
    res.render('createProducts', {})
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: ProductCategory, as: 'categories' }],
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  patch: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, images, price, description, categoryIds } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.update({ name, images, price, description });

      if (categoryIds && Array.isArray(categoryIds)) {
        const categories = await ProductCategory.findAll({
          where: { id: categoryIds },
        });
        await product.setCategories(categories);
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [{ model: ProductCategory, as: 'categories' }],
      });

      res.json(updatedProduct);
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

      await product.destroy();

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = productController;

const fs = require('fs');
const path = require('path');
const { Product, Cart, ProductCategory, ProductCategoryProduct, User, Review } = require('../../models');

const productController = {
  create: async (req, res) => {
    try {
      const categories = await ProductCategory.findAll();
      res.render('createProducts', {
        title: 'Supreme Agribet Feeds Supply Store',
        currentUrl: req.url,
        session: req.session || {},
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

      //res.status(201).json({ success: true, product });
      res.redirect('/admin/products/');
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
        session: req.session || {},
        products
      });

    } catch (error) {
      console.error('Error fetching products:', error);
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

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: ProductCategory, as: 'categories' }],
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.render('viewProducts',
        {
          title: 'Supreme Agribet Feeds Supply Store',
          currentUrl: req.url,
          session: req.session || {},
          product
        });

      //res.json(product);

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

      if (product.images && product.images !== path.join(__dirname, '..', '..', 'public', 'img/default-song.jpg') ) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          } else {
            console.log('Image deleted successfully:', imagePath);
          }
        });
      }
      await product.destroy();
      res.redirect('/admin/products/');
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = productController;

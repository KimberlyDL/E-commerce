'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsToMany(models.ProductCategory, {
        through: 'ProductCategoryProduct', // The join table
        foreignKey: 'product_id',          // Foreign key in ProductCategoryProduct table for Product
        otherKey: 'category_id',           // Foreign key in ProductCategoryProduct table for ProductCategory
        as: 'categories'                   // Alias for the associated categories
      });
      Product.hasMany(models.Cart, {
        foreignKey: 'productId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Product.hasMany(models.CheckoutItem, {
        foreignKey: 'checkoutId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
  });
  return Product;
};

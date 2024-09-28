'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      ProductCategory.belongsToMany(models.Product, {
        through: 'ProductCategoryProduct', // The join table
        foreignKey: 'category_id',         // Foreign key in ProductCategoryProduct table for ProductCategory
        otherKey: 'product_id',            // Foreign key in ProductCategoryProduct table for Product
        as: 'products'                     // Alias for the associated products
      });    }
  }
  ProductCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'ProductCategories',
  });
  return ProductCategory;
};

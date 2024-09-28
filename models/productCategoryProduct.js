'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategoryProduct extends Model {
    static associate(models) {
      // define associations if needed
    }
  }
  ProductCategoryProduct.init({
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ProductCategories',
        key: 'id',
      },
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'ProductCategoryProduct',
    tableName: 'ProductCategoryProducts',
    timestamps: false,
  });
  return ProductCategoryProduct;
};

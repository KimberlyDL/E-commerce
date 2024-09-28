'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      // define association here, e.g., belongsToMany for ProductCategoryProducts
    }
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

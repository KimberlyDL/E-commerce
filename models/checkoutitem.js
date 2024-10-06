'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckoutItem extends Model {
    static associate(models) {
      // CheckoutItem belongs to Checkout
      CheckoutItem.belongsTo(models.Checkout, {
        foreignKey: 'checkoutId',
        onDelete: 'CASCADE',
      });
      // CheckoutItem belongs to Product
      CheckoutItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
    }
  }
  
  CheckoutItem.init({
    checkoutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Checkout', // The name of the table for Checkout
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', // The name of the table for Product
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CheckoutItem',
    tableName: 'CheckoutItems', // Explicitly set the table name
  });
  
  return CheckoutItem;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Product, {
        foreignKey: 'productId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Cart.belongsTo(models.Checkout, {
        foreignKey: 'checkoutId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Cart.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkoutId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable until the checkout is created
      references: {
        model: 'Checkout', // Name of the table it references
        key: 'id', // Primary key in Checkout table
      },
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Cart',
  });
  return Cart;
};

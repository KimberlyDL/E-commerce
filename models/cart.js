'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart belongs to Product
      Cart.belongsTo(models.Product, {
        foreignKey: 'productId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      // Cart belongs to User
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      // Cart belongs to Checkout
      Cart.belongsTo(models.Checkout, {
        foreignKey: 'checkoutId',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',  // If Checkout is deleted, set the checkoutId to NULL
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
      allowNull: true, // Nullable until checkout is created
      references: {
        model: 'Checkout',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Cart',
  });

  return Cart;
};

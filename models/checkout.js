'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    static associate(models) {
      // Checkout belongs to a User
      Checkout.belongsTo(models.User, {
        foreignKey: 'userId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      Checkout.hasMany(models.Cart, {
        foreignKey: 'cartId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Checkout.init({
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cart',
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
    shippingDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    shopDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Checkout',
    tableName: 'Checkout',
  });
  return Checkout;
};

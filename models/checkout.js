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

      // Checkout has many Cart entries (so it can handle multiple items in one checkout)
      Checkout.hasMany(models.Cart, {
        foreignKey: 'checkoutId', // Updated to be 'checkoutId'
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  
  Checkout.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    shippingCost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    }
  }, {
    sequelize,
    modelName: 'Checkout',
    tableName: 'Checkout',
  });
  
  return Checkout;
};

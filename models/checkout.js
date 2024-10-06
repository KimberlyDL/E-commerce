'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    static associate(models) {
      // Checkout belongs to a User
      Checkout.belongsTo(models.User, {
        foreignKey: 'userId', // Foreign key in the Checkout table
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete the checkout if the user is deleted
      });

      // Checkout has many CheckoutItems (representing each product in the order)
      Checkout.hasMany(models.CheckoutItem, {
        foreignKey: 'checkoutId', // Foreign key in the CheckoutItem table
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Delete CheckoutItems if the checkout is deleted
      });
    }
  }

  Checkout.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // This references the User model/table
        key: 'id',
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    referenceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

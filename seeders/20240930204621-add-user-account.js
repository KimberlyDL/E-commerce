'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('kimenggg002', 10);

    return queryInterface.bulkInsert('Users', [{
      firstName: 'User',
      lastName: 'User',
      email: '1d3.de.leon.kimberly.nicole.i@gmail.com',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: '1d3.de.leon.kimberly.nicole.i@gmail.com' }, {});
  }
};
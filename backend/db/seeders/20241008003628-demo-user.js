'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
<<<<<<< HEAD

=======
>>>>>>> 71f2f8af3852b948e7a2e025060e4b99937bfafd
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Users';

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate( [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',              // Added
        lastName: 'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      // {
      //   email: 'user1@user.io',
      //   username: 'FakeUser1',
      //   firstName: 'User',              // Added
      //   lastName: 'One',
      //   hashedPassword: bcrypt.hashSync('password2')
      // },
      // {
      //   email: 'user2@user.io',
      //   username: 'FakeUser2',
      //   firstName: 'Usera',              // Added
      //   lastName: 'Two',
      //   hashedPassword: bcrypt.hashSync('password3')
      // }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete( {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};

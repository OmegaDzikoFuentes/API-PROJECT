'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      url: { [Op.in]: ['https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg', 'https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg', 'https://farm3.staticflickr.com/2220/1572613671_7311098b76_z_d.jpg'] }
    }, {});
  }
};

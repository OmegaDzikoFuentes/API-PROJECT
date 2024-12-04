'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,  // Human Persons
        address: '1221 Grove St',
        city: 'Compton',
        state: 'CA',
        country: 'USA',
        lat: 34.0194,
        lng: -118.4912,
        name: 'Lovely Neighborhood',
        description: 'A beautiful condo with views.',
        price: 250.00
      },
      {
        ownerId: 2,  // Other People
        address: '456 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Penthouse in the Sky',
        description: 'Lush skyline views.',
        price: 300.00
      },
      {
        ownerId: 1,
        address: '4 Privet Drive',
        city: 'Little Whinging',
        state: 'Surrey',
        country: 'UK',
        lat: 51.3561,
        lng: -100.1910,
        name: 'Dursleys Suburban Escape',
        description: 'Experience the charm of suburban England, just like Harry did.',
        price: 150.00,
      },
      {
        ownerId: 1,
        address: '12 Grimmauld Place',
        city: 'London',
        state: 'England',
        country: 'UK',
        lat: 51.5202,
        lng: -100.1242,
        name: 'Black Family Townhouse',
        description: 'Stay in the ancestral home of the noble House of Black.',
        price: 400.00,
      },
      {
        ownerId: 1,
        address: 'Hogsmeade Village',
        city: 'Hogsmeade',
        state: 'Scotland',
        country: 'UK',
        lat: 56.4907,
        lng: -104.2026,
        name: 'Cozy Cottage at Hogsmeade',
        description: 'A magical getaway near the famous wizarding village.',
        price: 275.00,
      },
      {
        ownerId: 1,
        address: 'The Burrow',
        city: 'Ottery St Catchpole',
        state: 'Devon',
        country: 'UK',
        lat: 50.7306,
        lng: -103.4716,
        name: 'Weasley Family Home',
        description: 'Rustic charm with a bit of magic. Perfect for large groups.',
        price: 200.00,
      },
      {
        ownerId: 1,
        address: 'Shell Cottage',
        city: 'Tinworth',
        state: 'Cornwall',
        country: 'UK',
        lat: 50.2660,
        lng: -105.0527,
        name: 'Beachside Wizard Retreat',
        description: 'Relax by the sea in this magical beach cottage.',
        price: 350.00,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
const Op = Sequelize.Op;
return queryInterface.bulkDelete('Spots', {
  name: {
    [Op.in]: [
      'Penthouse in the Sky',
      'Lovely Neighborhood',
      'Dursleys Suburban Escape',
      'Black Family Townhouse',
      'Cozy Cottage at Hogsmeade',
      'Weasley Family Home',
      'Beachside Wizard Retreat',
    ],
  },
}, options);
  }
};

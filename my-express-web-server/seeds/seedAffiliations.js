const mongoose = require('mongoose');
const Affiliation = require('../models/Affiliation');

const DEFAULT_AFFILIATIONS = [
    {
        name: 'Mariano Marcos State University',
        code: 'MMSU'
    },
    {
        name: 'Northern Iloilo State University',
        code: 'NISU'
    },
    {
        name: 'Pangasinan State University',
        code: 'PSU'
    },
    {
        name: 'Western Mindanao State University',
        code: 'WMSU'
    }
];

const seedAffiliations = async () => {
    try {
        // Check if affiliations already exist
        const existingAffiliations = await Affiliation.find();
        
        if (existingAffiliations.length === 0) {
            await Affiliation.insertMany(DEFAULT_AFFILIATIONS);
            console.log('Default affiliations seeded successfully');
        } else {
            console.log('Affiliations already exist, skipping seed');
        }
    } catch (error) {
        console.error('Error seeding affiliations:', error);
    }
};

module.exports = seedAffiliations;


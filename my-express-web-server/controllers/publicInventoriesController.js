const { response } = require('express');
const Inventory = require('../models/Inventory')
const User = require('../models/User')
const fs = require('fs');
var CryptoJS = require("crypto-js");

// @desc Get all inventories 
// @route GET /inventories
// @access Public
const getAllPublicInventories = async (req, res) => {
    try {
        // Get all inventories from MongoDB
        const inventories = await Inventory.find().lean()
        
        // If no inventories found, return empty array instead of error
        if (!inventories?.length) {
            const emptyResponse = CryptoJS.AES.encrypt(JSON.stringify([]), process.env.SECRET_KEY || "2023@REcMMSU").toString()
            return res.json(emptyResponse)
        }

        // Add username to each inventory and convert to GeoJSON format
        const publicInventoriesWithUser = await Promise.all(inventories.map(async (inventory) => {
            try {
                const user = await User.findById(inventory.user).lean().exec()
                
                // Convert to GeoJSON format
                const geoJsonFeature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: inventory.coordinates // [longitude, latitude]
                    },
                    properties: {
                        ...inventory.properties,
                        _id: inventory._id,
                        username: user?.username || 'Unknown User',
                        capacity: inventory.assessment?.capacity,
                        assessment: inventory.assessment
                    },
                    _id: inventory._id,
                    coordinates: inventory.coordinates // Keep original for backward compatibility
                }
                
                return geoJsonFeature
            } catch (userError) {
                console.error('Error fetching user:', userError)
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: inventory.coordinates
                    },
                    properties: {
                        ...inventory.properties,
                        _id: inventory._id,
                        username: 'Unknown User',
                        capacity: inventory.assessment?.capacity,
                        assessment: inventory.assessment
                    },
                    _id: inventory._id,
                    coordinates: inventory.coordinates
                }
            }
        }))
        
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(publicInventoriesWithUser), process.env.SECRET_KEY || "2023@REcMMSU").toString()
        res.json(encrypted)
        
    } catch (error) {
        console.error('Error in getAllPublicInventories:', error)
        // Return empty array on error instead of crashing
        const emptyResponse = CryptoJS.AES.encrypt(JSON.stringify([]), process.env.SECRET_KEY || "2023@REcMMSU").toString()
        res.json(emptyResponse)
    }
}

module.exports = {
    getAllPublicInventories,
}
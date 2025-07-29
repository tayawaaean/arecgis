const { response } = require('express');
const Inventory = require('../models/Inventory')
const User = require('../models/User')
const fs = require('fs');
var CryptoJS = require("crypto-js");
// @desc Get all inventories 
// @route GET /inventories
// @access Private
const getAllPublicInventories = async (req, res) => {
    // Get all inventories from MongoDB
    const inventories = await Inventory.find().lean()
    // If no Technical assessment
    if (!inventories?.length) {
        return res.status(400).json({ message: 'No Technical assessment found' })
    }


    // Add username to each inventory before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const publicInventoriesWithUser = await Promise.all(inventories.map(async (inventory) => {
        const user = await User.findById(inventory.user).lean().exec()
        return { ...inventory, username: user.username }
    }))
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(publicInventoriesWithUser), process.env.SECRET_KEY).toString()


    res.json(encrypted)

    // let x = JSON.stringify(publicInventoriesWithUser)

    // let charCodeArr = []

    // for(let i = 0; i < x.length; i++){
    //     let code = x.charCodeAt(i);
    //     charCodeArr.push(code);
    // }
    // let response
    // response = charCodeArr.toString()
    // response = response.replace(/,/g, '!')
 

    // out = String.fromCharCode(...response.split("!"))
    // out = JSON.parse(out)

    // res.json(x)
}


module.exports = {
    getAllPublicInventories,

}
const Renergy = require('../models/Renergy')
const User = require('../models/User')

// @desc Get all renergies 
// @route GET /renergies
// @access Private
const getAllRenergies = async (req, res) => {
    // Get all renergies from MongoDB
    const renergies = await Renergy.find().lean()
    
    // If no Technical assessment
    if (!renergies?.length) {
        return res.status(400).json({ message: 'No Technical assessment found' })
    }

    // Add username to each renergy before sending the response 
    const renergiesWithUser = await Promise.all(renergies.map(async (renergy) => {
        const user = await User.findById(renergy.user).lean().exec()
        return { ...renergy, username: user.username }
    }))

    res.json(renergiesWithUser)
}

// @desc Create new renergy
// @route POST /renergies
// @access Private
const createNewRenergy = async (req, res) => {
    const { type, user, coordinates, properties , assessment  } = req.body

    var images = req.files ? req.files.map((file) => file.filename) : []

    // Confirm data
    if (!user || !type || !coordinates || !properties ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Ensure ownUse and isNetMetered are set (default to "No" if not provided)
    properties.ownUse = properties.ownUse || "No"
    properties.isNetMetered = properties.isNetMetered || "No"

    // Create and store the new RE Tech assessment
    const renergy = await Renergy.create({ user, type, coordinates, properties, assessment, images })

    if (renergy) { // Created 
        return res.status(201).json({ message: 'New Technical assessment created' })
    } else {
        return res.status(400).json({ message: 'Invalid Technical assessment data received' })
    }
}

// @desc Update a renergy
// @route PATCH /renergies
// @access Private
const updateRenergy = async (req, res) => {
    const { id, user, type, coordinates, properties , assessment  } = req.body
    var images = req.files ? req.files.map((file) => file.filename) : []

    // Confirm data
    if (!id || !type || !coordinates || !properties) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm renergy exists to update
    const renergy = await Renergy.findById(id).exec()
    if (!renergy) {
        return res.status(400).json({ message: 'Technical assessment not found' })
    }

    renergy.user = user
    renergy.type = type
    renergy.coordinates = coordinates
    renergy.images =  [...renergy.images, ...images]
    renergy.properties.address.country = properties.address.country
    renergy.properties.address.region = properties.address.region
    renergy.properties.address.province = properties.address.province
    renergy.properties.address.city = properties.address.city
    renergy.properties.address.brgy = properties.address.brgy
    renergy.properties.ownerName = properties.ownerName
    renergy.properties.retype = properties.retype

    // These may or may not exist in properties, so set or update them as appropriate
    renergy.properties.isNetMetered = properties.isNetMetered || "No"
    renergy.properties.ownUse = properties.ownUse || "No"

    // Set other possible fields that might exist in properties
    if (properties.reCat) renergy.properties.reCat = properties.reCat
    if (properties.reClass) renergy.properties.reClass = properties.reClass
    if (properties.yearEst) renergy.properties.yearEst = properties.yearEst
    if (properties.acquisition) renergy.properties.acquisition = properties.acquisition

    renergy.assessment = assessment
    
    const updatedRenergy = await renergy.save()

    res.json(`'${updatedRenergy.type}' updated`)
}

const deleteImageRenergy = async (req, res) => {
    const { images, id } = req.body

    const renergy = await Renergy.findById(id).exec()
    const prevImages = renergy.images
    renergy.images = prevImages

    const updatedRenergy = await renergy.save()

    res.json(`'${updatedRenergy.type}' updated`)
}


// @desc Delete a renergy
// @route DELETE /renergies
// @access Private
const deleteRenergy = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Renergy ID required' })
    }

    // Confirm renergy exists to delete 
    const renergy = await Renergy.findById(id).exec()

    if (!renergy) {
        return res.status(400).json({ message: 'Renergy not found' })
    }

    const result = await renergy.deleteOne()

    const reply = `Renergy '${result.type}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllRenergies,
    createNewRenergy,
    deleteImageRenergy,
    updateRenergy,
    deleteRenergy,
}
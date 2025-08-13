const User = require('../models/User')
const Renergy = require('../models/Renergy')
const bcrypt = require('bcrypt')
var CryptoJS = require("crypto-js");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: '404 not found' })
    }
    // Prefer plain JSON over custom encryption for authenticated endpoints; rely on HTTPS + auth
    if (!process.env.RETURN_PLAINTEXT_JSON || process.env.RETURN_PLAINTEXT_JSON === 'true') {
        return res.json(users)
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(users), process.env.SECRET_KEY).toString();
    res.json(encrypted)
}

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, password, roles, fullName, address, contactNumber, affiliation, companyName, companyContactNumber } = req.body

    //confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' })
    }

    //check for duplicates
    const duplicates = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicates) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = {
        username,
        password: hashedPwd,
        roles: (!Array.isArray(roles) || !roles.length) ? ['Employee'] : roles,
        fullName: fullName || '',
        address: address || '',
        contactNumber: contactNumber || '',
        affiliation: affiliation || '',
        companyName: companyName || '',
        companyContactNumber: companyContactNumber || ''
    }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

}

// @desc Update a  user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, username, roles, active, password, currPW, isAdmin, isManager, fullName, address, contactNumber, affiliation, companyName, companyContactNumber } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active
    
    // Update profile fields if provided
    if (fullName !== undefined) user.fullName = fullName
    if (address !== undefined) user.address = address
    if (contactNumber !== undefined) user.contactNumber = contactNumber
    if (affiliation !== undefined) user.affiliation = affiliation
    if (companyName !== undefined) user.companyName = companyName
    if (companyContactNumber !== undefined) user.companyContactNumber = companyContactNumber
    
    if (password&&isAdmin ||password&&isManager) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }else if(password){
        const currMatch = await bcrypt.compare(currPW, user.password)
        const newMatch = await bcrypt.compare(password, user.password)

        if (!currMatch) return res.status(401).json({ message: 'Current password do not match!' })
        if (newMatch) return res.status(401).json({ message: 'The password is unchanged.' })
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

// @desc Delete a  user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned renewable energies?
    const note = await Renergy.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned renewable energies' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
}
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

// @desc Get user by ID
// @route GET /users/:id
// @access Private - Users can access their own profile, Admins/Managers can access any
const getUserById = async (req, res) => {
    const { id } = req.params
    const { user: username, roles } = req // from JWT middleware
    
    // Get the current user's ID from the database using username
    const currentUser = await User.findOne({ username }).select('_id').lean()
    if (!currentUser) {
        return res.status(404).json({ message: 'Current user not found' })
    }
    
    // Users can only access their own profile, or Admins/Managers can access any
    if (id !== currentUser._id.toString() && !roles.includes('Admin') && !roles.includes('Manager')) {
        return res.status(403).json({ message: 'Access denied - You can only view your own profile' })
    }
    
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    
    // Prefer plain JSON over custom encryption for authenticated endpoints; rely on HTTPS + auth
    if (!process.env.RETURN_PLAINTEXT_JSON || process.env.RETURN_PLAINTEXT_JSON === 'true') {
        return res.json(user)
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.SECRET_KEY).toString();
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

// @desc Update own profile (for regular users)
// @route PATCH /users/profile
// @access Private - Users can update their own profile
const updateOwnProfile = async (req, res) => {
    const { user: currentUsername, roles: currentRoles } = req // from JWT middleware
    const { fullName, address, contactNumber, affiliation, companyName, companyContactNumber, password, currPW } = req.body

    // Get the current user from the database
    const currentUser = await User.findOne({ username: currentUsername }).exec()
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Update profile fields if provided
    if (fullName !== undefined) currentUser.fullName = fullName
    if (address !== undefined) currentUser.address = address
    if (contactNumber !== undefined) currentUser.contactNumber = contactNumber
    if (affiliation !== undefined) currentUser.affiliation = affiliation
    if (companyName !== undefined) currentUser.companyName = companyName
    if (companyContactNumber !== undefined) currentUser.companyContactNumber = companyContactNumber

    // Handle password change if provided
    if (password) {
        if (!currPW) {
            return res.status(400).json({ message: 'Current password is required to change password' })
        }
        
        const currMatch = await bcrypt.compare(currPW, currentUser.password)
        if (!currMatch) {
            return res.status(401).json({ message: 'Current password does not match!' })
        }
        
        const newMatch = await bcrypt.compare(password, currentUser.password)
        if (newMatch) {
            return res.status(400).json({ message: 'The new password must be different from the current password' })
        }
        
        currentUser.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await currentUser.save()

    res.json({ message: `Profile updated successfully` })
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
    getUserById,
    createNewUser,
    updateUser,
    updateOwnProfile,
    deleteUser,
}
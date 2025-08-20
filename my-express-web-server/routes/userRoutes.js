const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const checkRoles = require('../middleware/checkRoles')

router.use(verifyJWT)

// Self-profile update route - users can update their own profile
router.route('/profile')
    .patch(usersController.updateOwnProfile)

// Individual user route - users can access their own profile, admins/managers can access any
router.route('/:id')
    .get(usersController.getUserById)

router.route('/')
    .get(checkRoles('Admin', 'Manager'), usersController.getAllUsers)
    .post(checkRoles('Admin', 'Manager'), usersController.createNewUser)
    .patch(checkRoles('Admin', 'Manager'), usersController.updateUser)
    .delete(checkRoles('Admin'), usersController.deleteUser)

module.exports = router
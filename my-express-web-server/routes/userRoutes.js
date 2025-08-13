const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const checkRoles = require('../middleware/checkRoles')

router.use(verifyJWT)


router.route('/')
    .get(checkRoles('Admin', 'Manager'), usersController.getAllUsers)
    .post(checkRoles('Admin', 'Manager'), usersController.createNewUser)
    .patch(checkRoles('Admin', 'Manager'), usersController.updateUser)
    .delete(checkRoles('Admin'), usersController.deleteUser)

module.exports = router
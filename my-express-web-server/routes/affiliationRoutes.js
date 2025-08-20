const express = require('express')
const router = express.Router()
const affiliationsController = require('../controllers/affiliationsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(affiliationsController.getAllAffiliations)
    .post(affiliationsController.createNewAffiliation)
    .patch(affiliationsController.updateAffiliation)

module.exports = router;


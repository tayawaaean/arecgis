const express = require('express')
const router = express.Router()
const publicBlogsController = require('../controllers/publicBlogsController')


router.route('/', )
    .get(publicBlogsController.getAllBlogs)
module.exports = router
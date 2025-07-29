const { response } = require('express');
const Blog = require('../models/Blog')
const User = require('../models/User')
const fs = require('fs');
// @desc Get all blogs 
// @route GET /blogs
// @access Private
const getAllBlogs = async (req, res) => {
    // Get all blogs from MongoDB
    const blogs = await Blog.find().lean()
    
    // If no Technical assessment
    if (!blogs?.length) {
        return res.status(400).json({ message: 'No Blog found' })
    }

    // Add username to each blog before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const blogsWithUser = await Promise.all(blogs.map(async (blog) => {
        const user = await User.findById(blog.user).lean().exec()
        return { ...blog, username: user.username }
    }))
    

    let x = JSON.stringify(blogsWithUser)

    let charCodeArr = []

    for(let i = 0; i < x.length; i++){
        let code = x.charCodeAt(i);
        charCodeArr.push(code);
    }
    let response
    response = charCodeArr.toString()
    response = response.replace(/,/g, '!')
 

    // out = String.fromCharCode(...response.split("!"))
    // out = JSON.parse(out)

    res.json(response)
}


module.exports = {
    getAllBlogs,
}   
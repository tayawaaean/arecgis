const Blog = require('../models/Blog')
const User = require('../models/User')
const fs = require('fs');
// @desc Get all blogs 
// @route GET /blogs
// @access Private
const getAllBlogs = async (req, res) => {
    // Get all blogs from MongoDB
    const blogs = await Blog.find().lean()
    
    // If no Technical blogContent
    if (!blogs?.length) {
        return res.status(400).json({ message: 'No Blogs found' })
    }

    // Add username to each blog before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const blogsWithUser = await Promise.all(blogs.map(async (blog) => {
        const user = await User.findById(blog.user).lean().exec()
        return { ...blog, username: user.username }
    }))

    res.json(blogsWithUser)
}

// @desc Create new blog
// @route POST /blogs
// @access Private

const createNewBlog = async (req, res) => {
    
    const { user, blogTitle, blogSummary , blogContent  } = req.body

    var images = req.files.map( (file) => {
        return file.filename // or file.originalname
    })


    //Confirm data
    if ( !user || !blogTitle || !blogSummary || !blogContent  ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate re
    // const duplicate = await Blog.findOne({ title }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate blog title' })
    // }

    // Create and store the new RE Tech blogContent
    const blog = await Blog.create({user, blogTitle, blogSummary, blogContent, images })

    if (blog) { // Created 
        return res.status(201).json({ message: 'New Technical blogContent created' })
    } else {
        return res.status(400).json({ message: 'Invalid Technical blogContent data received' })
    }

}

// @desc Update a blog
// @route PATCH /blogs
// @access Private
const updateBlog = async (req, res) => {

    const { id, user, blogTitle, blogSummary , blogContent  } = req.body

    var images = req.files.map( (file) => {
        return file.filename // or file.originalname
    })

    // Confirm data
    if (!id || !user || !blogTitle || !blogSummary || !blogContent ) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    // Confirm blog exists to update
    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    // // Check for duplicate title
    // const duplicate = await Blog.findOne({ title }).lean().exec()

    // // Allow renaming of the original blog 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate blog title' })
    // }

    blog.user = user
    blog.blogTitle = blogTitle
    blog.blogSummary = blogSummary
    blog.blogContent = blogContent
    blog.images =  [...blog.images, ...images]
    
    const updatedBlog = await blog.save()

    res.json(`'${updatedBlog.type}' updated`)
}

const deleteImageBlog = async (req, res) => {

    const { images, id } = req.body

    const blog = await Blog.findById(id).exec()

    const prevImages = blog.images
    const newImages = prevImages.splice(images, 1)

    blog.images = prevImages

    fs.unlink('./public/uploads/postimages/' + newImages, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
    const updatedBlog = await blog.save()

    res.json(`'${updatedBlog.type}' updated`)
}


// @desc Delete a blog
// @route DELETE /blogs
// @access Private
const deleteBlog = async (req, res) => {

    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Blog ID required' })
    }

    // Confirm blog exists to delete 
    const blog = await Blog.findById(id).exec()

    if (!blog) {
        return res.status(400).json({ message: 'Blog not found' })
    }

    const result = await blog.deleteOne()

    const reply = `Blog '${result.type}' with ID ${result._id} deleted`

    res.json(reply)
}


module.exports = {
    getAllBlogs,
    createNewBlog,
    deleteImageBlog,
    updateBlog,
    deleteBlog,
}
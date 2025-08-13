const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const assert = require('assert');
const mongoose = require('mongoose')
const Inventory = require('../models/Inventory')

// Lazily get GridFS buckets using the existing app-level mongoose connection
function getBucket(name) {
    const db = mongoose.connection && mongoose.connection.db
    if (!db) {
        const err = new Error('Storage not ready')
        err.status = 503
        throw err
    }
    return new mongoose.mongo.GridFSBucket(db, { bucketName: name })
}


const getImage = async (req, res) => {
    const objectId = req.params.id
    const gfsi = getBucket('uploads')
    gfsi.find({ filename: objectId }).toArray((err, files) => {
        if (err) return res.status(500).json({ err: 'Error retrieving image' })
        if (!files[0] || files.length === 0) {
            return res.status(404).json({ err: 'Image not found' });
        }
        if (['image/jpeg','image/png','image/webp'].includes(files[0].contentType)) {
            return gfsi.openDownloadStreamByName(objectId).pipe(res)
        }
        return res.status(404).json({ err: 'Not an image' });
    })
}

const getMobile = async (req, res) => {
    const objectId = req.params.id
    const mobilegfsi = getBucket('mobile')
    mobilegfsi.find({ _id: ObjectId(objectId) }).toArray((err, files) => {
        if (err) return res.status(500).json({ err: 'Error retrieving file' })
        if (!files[0] || files.length === 0) {
            return res.status(404).json({ err: 'File not found' });
        }
        res.set('Content-disposition', `attachment; filename=${files[0].filename}`);
        res.set('Content-Type', 'application/vnd.android.package-archive');
        mobilegfsi.openDownloadStreamByName(files[0].filename).pipe(res)
    })
}

// @desc Delete a inventory
// @route DELETE /images
// @access Private


const deleteImage = async (req, res) => {
    const { images, id } = req.body
    if (typeof images === 'undefined' || !id) {
        return res.status(400).json({ message: 'id and images index are required' })
    }
    const inventory = await Inventory.findById(id).exec()
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' })

    const prevImages = Array.isArray(inventory.images) ? inventory.images : []
    if (images < 0 || images >= prevImages.length) {
        return res.status(400).json({ message: 'Invalid image index' })
    }

    const [removed] = prevImages.splice(images, 1)
    inventory.images = prevImages

    // Delete from GridFS if exists
    if (removed) {
        const gfsi = getBucket('uploads')
        const file = await gfsi.find({ filename: removed }).toArray()
        if (file.length > 0) {
            await gfsi.delete(file[0]._id)
        }
    }

    const updatedInventory = await inventory.save()
    res.json(`'${updatedInventory.type}' updated`)
}

module.exports = {
    getMobile,
    getImage,
    deleteImage,
}
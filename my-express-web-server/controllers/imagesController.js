const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const assert = require('assert');

const mongoose = require('mongoose')

let gfsi;
let mobilegfsi;
(async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
        const { db } = mongoose.connection;
        gfsi = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
        mobilegfsi = new mongoose.mongo.GridFSBucket(db, { bucketName: 'mobile' });
    }
    catch (err) {
        console.log(err);
    }
})();


const getImage = async (req, res) => {

    const objectId = req.params.id
    gfsi.find({ filename: objectId }).toArray((err, files) => {
        if (!files[0] || files.length === 0) {
            return res.status(404).json({ err: 'Image not found' });
        }

        if (files[0].contentType === 'image/jpeg'
            || files[0].contentType === 'image/png'
            || files[0].contentType === 'image/webp') {

            gfsi.openDownloadStreamByName(objectId).pipe(res)
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    })
}

const getMobile = async (req, res) => {

    const objectId = req.params.id
    mobilegfsi.find({ _id: ObjectId(objectId) }).toArray((err, files) => {

        if (!files[0] || files.length === 0) {
            return res.status(404).json({ err: 'File not found' });
        }else{
            res.set('Content-disposition', `attachment; filename=${files[0].filename}`);
            res.set('Content-Type', 'application/vnd.android.package-archive');
            mobilegfsi.openDownloadStreamByName(files[0].filename).pipe(res)

        }


    })
}

// @desc Delete a inventory
// @route DELETE /images
// @access Private


const deleteImage = async (req, res) => {

    const { images, id } = req.body

    const inventory = await Inventory.findById(id).exec()

    const prevImages = inventory.images
    const newImages = prevImages.splice(images, 1)

    inventory.images = prevImages

    const updatedInventory = await inventory.save()

    res.json(`'${updatedInventory.type}' updated`)
}

module.exports = {
    getMobile,
    getImage,
    deleteImage,
}
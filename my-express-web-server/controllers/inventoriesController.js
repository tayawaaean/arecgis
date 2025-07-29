const Inventory = require('../models/Inventory')
const User = require('../models/User')
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const mongoose = require('mongoose')
const mongoURI = process.env.DATABASE_URI
const { Readable } = require("stream"); // from nodejs
const sharp = require("sharp");
const crypto = require('crypto')
var CryptoJS = require("crypto-js");
// const fs = require('fs');
// const assert = require('assert');

let gfsi;
(async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
        const { db } = mongoose.connection;
        gfsi = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
    }
    catch (err) {
        console.log(err);
    }
})()



// @desc Get all inventories 
// @route GET /inventories
// @access Private
const getAllInventories = async (req, res) => {
    // Get all inventories from MongoDB

    const inventories = await Inventory.find().lean()


    // If no Technical assessment
    if (!inventories?.length) {
        return res.status(400).json({ message: 'No Technical assessment found' })
    }

    
    // out = String.fromCharCode(...response.split("!"))
    // out = JSON.parse(out)


    // Add username to each inventory before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const inventoriesWithUser = await Promise.all(inventories.map(async (inventory) => {
        const user = await User.findById(inventory.user).lean().exec()
        return { ...inventory, username: user.username }
    }))
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(inventoriesWithUser), process.env.SECRET_KEY).toString()
    // let x = JSON.stringify(inventoriesWithUser)

    // let charCodeArr = []

    // for(let i = 0; i < x.length; i++){
    //     let code = x.charCodeAt(i);
    //     charCodeArr.push(code);
    // }
    // let response
    // response = charCodeArr.toString()
    // response = response.replace(/,/g, '!')
 

    // out = String.fromCharCode(...response.split("!"))
    // out = JSON.parse(out)

    res.json(encrypted)

}

// @desc Create new inventory
// @route POST /inventories
// @access Private

const createNewInventory = async (req, res) => {

    const { type, user, coordinates, properties, assessment } = req.body

    const images = req.files.map((file) => {

        const randombytes = crypto.randomBytes(16)
        const filename = randombytes.toString('hex') + '.webp'
        const gridFsStorage = new GridFsStorage({
            url: mongoURI,
            options: { useUnifiedTopology: true }, // silence the warning
            file: () => ({ bucketName: "uploads", filename: filename, contentType: 'image/webp' }),
        })

        sharp(file.buffer)
            .rotate()
            .toFormat('webp')
            .resize(1080)
            .webp({ quality: 70 })
            // .jpeg({ quality: 70 })  
            .toBuffer((err, data, info) => {
                // data here directly contains the buffer object.
                const fileStream = Readable.from(data);
                // write the resized stream to the database.
                gridFsStorage.fromStream(fileStream)
            });

            return filename
    })
    // var images = req.files.map( (file) => {
    //     const img = {
    //         data: fs.readFileSync(path.join('./public/uploads/postimages/' + file.filename)),
    //         contentType: 'image/png'
    //     }

    //     return  img
    //     return file.filename // or file.originalname
    // })
    // var img = {
    //         data: fs.readFileSync(path.join('./public/uploads/postimages/' + req.file.filename)),
    //         contentType: 'image/png'
    //     }
    //Confirm data
    if (!user 
        || !type 
        || !coordinates
        || !properties.ownerName
        || !properties.reCat
        || !properties.reClass
        || !properties.yearEst
        || !properties.acquisition  
        || !properties.address.country
        || !properties.address.region
        || !properties.address.province
        || !properties.address.city
        || !properties.address.brgy) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate re
    // const duplicate = await Inventory.findOne({ title }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate inventory title' })
    // }

    // Create and store the new RE Tech assessment
    const inventory = await Inventory.create({ user, type, coordinates, properties, assessment, images })

    if (inventory) { // Created 
        return res.status(201).json({ message: 'New Technical assessment created' })
    } else {
        return res.status(400).json({ message: 'Invalid Technical assessment data received' })
    }

}

// @desc Update a inventory
// @route PATCH /inventories
// @access Private
const updateInventory = async (req, res, err) => {


    const { id, user, type, coordinates, properties, assessment } = req.body
    // fs.createReadStream('./ARECGIS_v1.0.0.apk').
    // pipe(gfsi.openUploadStream('ARECGIS_v1.0.0.apk')).
    // on('error', function(error) {
    //     assert.ifError(error);
    //   }).
    //   on('finish', function() {
    //     console.log('done!');
    //     process.exit(0);
    //   });

    // var images = req.files.map( (file) => {
    //     const img = {
    //         data: fs.readFileSync(path.join('./public/uploads/postimages/' + file.filename)),
    //         contentType: file.mimetype
    //     }

    //     return  img
    //     return file.filename // or file.originalname
    // })

    // var imagesz = req.files.map((file) => {
    //     const img = file.filename
    //     return img
    // })
    // console.log(imagesz)


    const images = req.files.map((file) => {

        const randombytes = crypto.randomBytes(5)
        const filename = randombytes.toString('hex') +'.webp'
        const gridFsStorage = new GridFsStorage({
            url: mongoURI,
            options: { useUnifiedTopology: true }, // silence the warning
            file: () => ({ bucketName: "uploads", filename: filename, contentType: 'image/webp' }),
        })

        sharp(file.buffer)
            .rotate()
            .toFormat('webp')
            .resize(1080)
            .webp({  quality: 70 })
            // .rotate()
            // .webp({ lossless: true })
            // .jpeg({ quality: 70 })  
            .toBuffer((err, data, info) => {
                // data here directly contains the buffer object.
                const fileStream = Readable.from(data);
                // write the resized stream to the database.
                gridFsStorage.fromStream(fileStream)
            })

            return filename
    })

    // Confirm data
    if (!id
        || !type 
        || !coordinates
        || !properties.ownerName
        || !properties.reCat
        || !properties.reClass
        || !properties.yearEst
        || !properties.acquisition  
        || !properties.address.country
        || !properties.address.region
        || !properties.address.province
        || !properties.address.city
        || !properties.address.brgy) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    // var images = req.files.map( (file) => {
    //     return file.filename // or file.originalname
    // })

    // Confirm inventory exists to update
    const inventory = await Inventory.findById(id).exec()

    if (!inventory) {
        return res.status(400).json({ message: 'Technical assessment not found' })
    }
    // // Check for duplicate title
    // const duplicate = await Inventory.findOne({ title }).lean().exec()

    // // Allow renaming of the original inventory 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate inventory title' })
    // }

    inventory.user = user
    inventory.type = type
    inventory.coordinates = coordinates
    inventory.images = [...inventory.images, ...images]
    inventory.properties.address.country = properties.address.country
    inventory.properties.address.region = properties.address.region
    inventory.properties.address.province = properties.address.province
    inventory.properties.address.city = properties.address.city
    inventory.properties.address.brgy = properties.address.brgy
    inventory.properties.ownerName = properties.ownerName
    inventory.properties.reCat = properties.reCat
    inventory.properties.reClass = properties.reClass
    inventory.properties.yearEst = properties.yearEst
    inventory.properties.acquisition = properties.acquisition
    inventory.assessment = assessment

    const updatedInventory = await inventory.save()

    res.json(`'${updatedInventory.type}' updated`)
}

const deleteImageInventory = async (req, res) => {

    const { images, id } = req.body
    const inventory = await Inventory.findById(id).exec()
    const prevImages = inventory.images

    const newImages = prevImages.splice(images, 1)
    inventory.images = prevImages
    const item = newImages[0]

    const file = await gfsi.find({ filename: item }).toArray();

    if (file.length > 0) {
        await gfsi.delete(file[0]._id);
        const updatedInventory = await inventory.save()
        res.json(`'${updatedInventory.type}' updated`)
      } else {
        console.log('Image file not found.');
      }
    } 
    // gfsi.delete(new mongoose.Types.ObjectId(newImages[0]), (err, data) => {
    //     if (err) {
    //         return res.status(404).json({ err: err })
    //     }


    // })
    // fs.unlink('./public/uploads/postimages/' + newImages, (err) => {
    //     if (err) {
    //         throw err;
    //     }

    //     console.log("Delete File successfully.");
    // });



// @desc Delete a inventory
// @route DELETE /inventories
// @access Private
const deleteInventory = async (req, res) => {

    const { id } = req.body
    // console.log(id.length)
    // console.log(id)
    //Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Inventory ID required' })
    }

    // Confirm inventory exists to delete 
    // id.map
    // const inventory = await Inventory.findById(id).exec()
    const inventory = id.map(async x =>  {
        const singleInventory = await Inventory.findById(x).exec()
        if (!singleInventory) {
            return res.status(400).json({ message: 'Inventory not found' })
        }
        const prevImages = singleInventory.images

        prevImages.map(async file => {

            const documents = await gfsi.find({ filename: file }).toArray();
    
            if (documents.length > 0) {
                await gfsi.delete(documents[0]._id)
    
            } else {
                console.log('Image file not found.')
            }
        })
        singleInventory.deleteOne()

    })

    // if (!inventory) {
    //     return res.status(400).json({ message: 'Inventory not found' })
    // }
    // const prevImages = inventory.images

    // prevImages.map(async file => {

    //     const documents = await gfsi.find({ filename: file }).toArray();

    //     if (documents.length > 0) {
    //         await gfsi.delete(documents[0]._id)

    //     } else {
    //         console.log('Image file not found.')
    //     }
    // })

    // const result = await inventory.deleteOne()
    // const reply = `Inventory '${result.type}' with ID ${result._id} deleted`
    const reply = `Inventory deleted`

    res.json(reply)
}



module.exports = {
    getAllInventories,
    createNewInventory,
    deleteImageInventory,
    updateInventory,
    deleteInventory,

}
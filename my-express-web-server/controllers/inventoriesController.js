const Inventory = require('../models/Inventory');
const User = require('../models/User');
const mongoose = require('mongoose');
const { Readable } = require("stream");
const sharp = require("sharp");
const crypto = require('crypto');
var CryptoJS = require("crypto-js");

function getBucket() {
    const db = mongoose.connection && mongoose.connection.db
    if (!db) {
        const err = new Error('Storage not ready')
        err.status = 503
        throw err
    }
    return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' })
}

const DUPLICATE_RADIUS_METERS = 100;

// Helper: Extract coordinates as flat array from any format
function extractCoordinates(coords) {
    console.log('extractCoordinates called with:', coords, 'type:', typeof coords);
    
    if (Array.isArray(coords) && coords.length === 2) {
        const result = coords.map(Number);
        console.log('Extracted from array:', result);
        return result;
    }
    if (coords && coords.type === "Point" && Array.isArray(coords.coordinates) && coords.coordinates.length === 2) {
        const result = coords.coordinates.map(Number);
        console.log('Extracted from GeoJSON:', result);
        return result;
    }
    if (typeof coords === "string") {
        try { 
            const parsed = JSON.parse(coords);
            console.log('Parsed JSON string:', parsed);
            if (Array.isArray(parsed) && parsed.length === 2) {
                const result = parsed.map(Number);
                console.log('Extracted from parsed JSON array:', result);
                return result;
            }
            if (parsed && parsed.coordinates && Array.isArray(parsed.coordinates) && parsed.coordinates.length === 2) {
                const result = parsed.coordinates.map(Number);
                console.log('Extracted from parsed JSON coordinates:', result);
                return result;
            }
        } catch (e) {
            console.log('Failed to parse JSON string:', e);
        }
    }
    console.log('No valid coordinates found, returning null');
    return null;
}

// Helper: Create GeoJSON Point for spatial queries (but not for storage)
function createGeoJsonPoint(coords) {
    const coordArray = extractCoordinates(coords);
    if (coordArray && coordArray.length === 2) {
        return { type: "Point", coordinates: coordArray };
    }
    return null;
}

// Helper: Validate if a string is a valid number (integer or decimal, no special chars, no letters)
function isValidNumber(val) {
    if (typeof val === 'number') {
        return !isNaN(val);
    }
    if (typeof val === 'string') {
        return /^(\d+(\.\d+)?|\.\d+)$/.test(val.trim());
    }
    return false;
}

// Helper: Validate year is 4-digit and reasonable
function isValidYear(val) {
    return /^[1-2][0-9]{3}$/.test(val) && Number(val) >= 1900 && Number(val) <= (new Date()).getFullYear() + 10;
}

// Helper: Validate required string
function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

// Helper: Validate coordinates
function isValidCoordinates(coords) {
    const coordArray = extractCoordinates(coords);
    return coordArray && coordArray.length === 2 &&
           !isNaN(coordArray[0]) && !isNaN(coordArray[1]);
}

// @desc Get all inventories, with optional filter by solarSystemTypes
// @route GET /inventories
// @access Private
const getAllInventories = async (req, res) => {
    const { solarSystemTypes } = req.query;
    let query = {};
    if (solarSystemTypes) {
        query = { "assessment.solarSystemTypes": solarSystemTypes };
    }
    const inventories = await Inventory.find(query).lean();
    if (!inventories?.length) {
        return res.status(400).json({ message: 'No Technical assessment found' });
    }
    const inventoriesWithUser = await Promise.all(inventories.map(async (inventory) => {
        const user = await User.findById(inventory.user).lean().exec();
        return { ...inventory, username: user?.username };
    }));
    if (!process.env.RETURN_PLAINTEXT_JSON || process.env.RETURN_PLAINTEXT_JSON === 'true') {
        return res.json(inventoriesWithUser)
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(inventoriesWithUser), process.env.SECRET_KEY).toString();
    res.json(encrypted);
};

// @desc Create new inventory (with geolocation-based duplicate detection)
// @route POST /inventories
// @access Private
const createNewInventory = async (req, res) => {
    let { type, user, coordinates, properties, assessment, forceCreate } = req.body;

    // Debug logging for assessment data
    console.log('Backend - Raw assessment data received:', {
        assessment,
        assessmentType: typeof assessment,
        hasSolarSubcategory: assessment?.solarPowerGenSubcategory ? 'Yes' : 'No'
    });

    if (typeof properties === 'string') {
        try { properties = JSON.parse(properties); } catch { properties = {}; }
    }
    if (typeof assessment === 'string') {
        try { assessment = JSON.parse(assessment); } catch { assessment = {}; }
    }

    // Debug logging after parsing
    console.log('Backend - Parsed assessment data:', {
        assessment,
        assessmentType: typeof assessment,
        hasSolarSubcategory: assessment?.solarPowerGenSubcategory ? 'Yes' : 'No',
        solarSubcategoryDetails: assessment?.solarPowerGenSubcategory
    });

    // Validate required fields
    if (!user
        || !type
        || !coordinates
        || !properties.ownerName
        || !properties.reCat
        || !properties.reClass
        || !properties.yearEst
        || !properties.acquisition
        || !properties.address
        || !properties.address.country
        || !properties.address.region
        || !properties.address.province
        || !properties.address.city
        || !properties.address.brgy
    ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isNonEmptyString(properties.ownerName)
        || !isNonEmptyString(properties.reCat)
        || !isNonEmptyString(properties.reClass)
        || !isValidYear(properties.yearEst)
        || !isNonEmptyString(properties.acquisition)
        || !isNonEmptyString(properties.address.country)
        || !isNonEmptyString(properties.address.region)
        || !isNonEmptyString(properties.address.province)
        || !isNonEmptyString(properties.address.city)
        || !isNonEmptyString(properties.address.brgy)) {
        return res.status(400).json({ message: 'Some fields are empty or invalid.' });
    }
    if (!(type === "Point")) {
        return res.status(400).json({ message: 'Type must be "Point".' });
    }

    // --- FIT validation for Commercial RE ---
    if (properties.reClass === "Commercial") {
        if (!properties.fit) {
            return res.status(400).json({ message: 'FIT info is required for Commercial RE.' });
        }
        
        const validPhases = ["FIT1", "FIT2", "Non-FIT"];
        
        // Convert string to boolean if needed
        if (typeof properties.fit.eligible === 'string') {
            properties.fit.eligible = properties.fit.eligible.toLowerCase() === 'true';
        }
        
        if (typeof properties.fit.eligible !== 'boolean') {
            return res.status(400).json({ message: 'FIT eligibility must be true or false.' });
        }
        
        if (!validPhases.includes(properties.fit.phase)) {
            return res.status(400).json({ message: 'FIT phase must be FIT1, FIT2, or Non-FIT.' });
        }
        
        // Check rate without using hasOwnProperty
        const rate = properties.fit.rate;
        if (rate !== undefined && rate !== null && rate !== '') {
            if (!isValidNumber(rate)) {
                return res.status(400).json({ message: 'FIT rate must be a valid number if provided.' });
            }
        }
    } else {
        // Remove FIT if not commercial
        if (properties.fit) delete properties.fit;
    }

    // Extract and validate coordinates as flat array
    const coordArray = extractCoordinates(coordinates);
    if (!coordArray) {
        return res.status(400).json({ message: "Invalid coordinates format" });
    }

    // Create GeoJSON Point for spatial queries
    const geoJsonPoint = createGeoJsonPoint(coordArray);

    // Capacity validation (optional, but if present, must be valid number)
    if (assessment && Object.prototype.hasOwnProperty.call(assessment, 'capacity') && assessment.capacity !== "") {
        if (!isValidNumber(assessment.capacity)) {
            return res.status(400).json({
                message: 'Capacity must be a valid number (digits and optional decimal point only).'
            });
        }
    }

    // Annual Energy Production validation (if Power Generation)
    if (
        assessment &&
        assessment.solarUsage === "Power Generation" &&
        Object.prototype.hasOwnProperty.call(assessment, 'annualEnergyProduction')
    ) {
        if (!isValidNumber(assessment.annualEnergyProduction)) {
            return res.status(400).json({
                message: 'Annual Energy Production must be a valid number (digits and optional decimal point only).'
            });
        }
    }

    // Solar system types optional, but if not blank, must match allowed
    if (assessment && assessment.solarSystemTypes) {
        const allowedTypes = ['Off-grid', 'Grid-tied', 'Hybrid'];
        if (assessment.solarSystemTypes && !allowedTypes.includes(assessment.solarSystemTypes)) {
            return res.status(400).json({ message: 'Invalid solarSystemTypes value.' });
        }
        
        // Validate that Off-grid systems cannot be net-metered
        if (assessment.solarSystemTypes === 'Off-grid' && properties.isNetMetered === 'Yes') {
            return res.status(400).json({ 
                message: 'Off-grid solar systems cannot be net-metered. Net-metered systems must be connected to the grid.' 
            });
        }
    }
    
    // Validate that Solar Street Lights and Solar Pump cannot be selected for power generation systems
    if (assessment && assessment.solarUsage) {
        const powerGenerationUsages = ['Solar Street Lights', 'Solar Pump'];
        const isPowerGenerationSystem = properties.isNetMetered === 'Yes' || properties.isDer === 'Yes' || properties.ownUse === 'Yes';
        
        if (isPowerGenerationSystem && powerGenerationUsages.includes(assessment.solarUsage)) {
            return res.status(400).json({ 
                message: 'Solar Street Lights and Solar Pump cannot be selected for power generation systems (Net-metered, DER, or Own-use). These systems must use Power Generation.' 
            });
        }
    }

    // Handle files/images - Process them properly with GridFS
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            try {
                const randombytes = crypto.randomBytes(16);
                const filename = randombytes.toString('hex') + '.webp';
                
                // Process image with sharp
                const processedBuffer = await sharp(file.buffer)
                    .rotate()
                    .toFormat('webp')
                    .resize(1080)
                    .webp({ quality: 70 })
                    .toBuffer();
                
                // Upload to GridFS
                const uploadStream = getBucket().openUploadStream(filename, {
                    contentType: 'image/webp'
                });
                
                const fileStream = Readable.from(processedBuffer);
                await new Promise((resolve, reject) => {
                    fileStream.pipe(uploadStream)
                        .on('error', reject)
                        .on('finish', resolve);
                });
                
                images.push(filename);
            } catch (err) {
                console.error('Error processing image:', err);
                // Continue with other images
            }
        }
    }

    // Set default Yes/No for net metered and own use if not present
    properties.isNetMetered = properties.isNetMetered || "No";
    properties.isDer = properties.isDer || "No";
    properties.ownUse = properties.ownUse || "No";

    // Remove establishment type for solar power generation to prevent conflicts with solar subcategories
    if (assessment && assessment.solarUsage === "Power Generation") {
        if (properties.establishmentType) {
            delete properties.establishmentType;
        }
    }

    if (!forceCreate) {
        const possibleDuplicates = await Inventory.find({
            coordinates: {
                $near: {
                    $geometry: geoJsonPoint,
                    $maxDistance: DUPLICATE_RADIUS_METERS
                }
            }
        }).lean();

        if (possibleDuplicates && possibleDuplicates.length > 0) {
            return res.status(409).json({
                message: "Potential duplicate detected",
                duplicates: possibleDuplicates
            });
        }
    }

    // Save with flat coordinates structure
    const inventory = await Inventory.create({
        user,
        type,
        coordinates: coordArray, // Store as flat array
        properties,
        assessment,
        images
    });

    if (inventory) {
        return res.status(201).json({ message: 'New Technical assessment created' });
    } else {
        return res.status(400).json({ message: 'Invalid Technical assessment data received' });
    }
};

// @desc Update a inventory (with geolocation-based duplicate detection)
// @route PATCH /inventories
// @access Private
const updateInventory = async (req, res) => {
    let { id, user, type, coordinates, properties, assessment, forceUpdate } = req.body;

    console.log('updateInventory received:', {
        id, user, type, coordinates, 
        coordinatesType: typeof coordinates,
        forceUpdate
    });

    if (typeof forceUpdate === "string") {
        forceUpdate = forceUpdate === "true";
    }

    if (typeof properties === 'string') {
        try { properties = JSON.parse(properties); } catch { properties = {}; }
    }
    if (typeof assessment === 'string') {
        try { assessment = JSON.parse(assessment); } catch { assessment = {}; }
    }

    // Validate required fields
    if (!id
        || !type
        || !coordinates
        || !properties.ownerName
        || !properties.reCat
        || !properties.reClass
        || !properties.yearEst
        || !properties.acquisition
        || !properties.address
        || !properties.address.country
        || !properties.address.region
        || !properties.address.province
        || !properties.address.city
        || !properties.address.brgy) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isNonEmptyString(properties.ownerName)
        || !isNonEmptyString(properties.reCat)
        || !isNonEmptyString(properties.reClass)
        || !isValidYear(properties.yearEst)
        || !isNonEmptyString(properties.acquisition)
        || !isNonEmptyString(properties.address.country)
        || !isNonEmptyString(properties.address.region)
        || !isNonEmptyString(properties.address.province)
        || !isNonEmptyString(properties.address.city)
        || !isNonEmptyString(properties.address.brgy)) {
        return res.status(400).json({ message: 'Some fields are empty or invalid.' });
    }
    if (!(type === "Point")) {
        return res.status(400).json({ message: 'Type must be "Point".' });
    }

    // --- FIT validation for Commercial RE ---
    if (properties.reClass === "Commercial") {
        if (!properties.fit) {
            return res.status(400).json({ message: 'FIT info is required for Commercial RE.' });
        }
        
        const validPhases = ["FIT1", "FIT2", "Non-FIT"];
        
        // Convert string to boolean if needed
        if (typeof properties.fit.eligible === 'string') {
            properties.fit.eligible = properties.fit.eligible.toLowerCase() === 'true';
        }
        
        if (typeof properties.fit.eligible !== 'boolean') {
            return res.status(400).json({ message: 'FIT eligibility must be true or false.' });
        }
        
        if (!validPhases.includes(properties.fit.phase)) {
            return res.status(400).json({ message: 'FIT phase must be FIT1, FIT2, or Non-FIT.' });
        }
        
        // Check rate without using hasOwnProperty
        const rate = properties.fit.rate;
        if (rate !== undefined && rate !== null && rate !== '') {
            if (!isValidNumber(rate)) {
                return res.status(400).json({ message: 'FIT rate must be a valid number if provided.' });
            }
        }
    } else {
        // Remove FIT if not commercial
        if (properties.fit) delete properties.fit;
    }

    // Extract and validate coordinates as flat array
    const coordArray = extractCoordinates(coordinates);
    if (!coordArray) {
        return res.status(400).json({ message: "Invalid coordinates format" });
    }

    // Create GeoJSON Point for spatial queries
    const geoJsonPoint = createGeoJsonPoint(coordArray);
    
    console.log('Update coordinates processing:', {
        receivedCoordinates: coordinates,
        extractedCoordArray: coordArray,
        geoJsonPoint,
        coordArrayType: typeof coordArray,
        coordArrayLength: coordArray?.length
    });

    // Capacity validation (optional, but if present, must be valid number)
    if (assessment && Object.prototype.hasOwnProperty.call(assessment, 'capacity') && assessment.capacity !== "") {
        if (!isValidNumber(assessment.capacity)) {
            return res.status(400).json({
                message: 'Capacity must be a valid number (digits and optional decimal point only).'
            });
        }
    }
    
    // Annual Energy Production validation (if Power Generation)
    if (
        assessment &&
        assessment.solarUsage === "Power Generation" &&
        Object.prototype.hasOwnProperty.call(assessment, 'annualEnergyProduction')
    ) {
        if (!isValidNumber(assessment.annualEnergyProduction)) {
            return res.status(400).json({
                message: 'Annual Energy Production must be a valid number (digits and optional decimal point only).'
            });
        }
    }

    // Solar system types optional, but if not blank, must match allowed
    if (assessment && assessment.solarSystemTypes) {
        const allowedTypes = ['Off-grid', 'Grid-tied', 'Hybrid'];
        if (assessment.solarSystemTypes && !allowedTypes.includes(assessment.solarSystemTypes)) {
            return res.status(400).json({ message: 'Invalid solarSystemTypes value.' });
        }
        
        // Validate that Off-grid systems cannot be net-metered
        if (assessment.solarSystemTypes === 'Off-grid' && properties.isNetMetered === 'Yes') {
            return res.status(400).json({ 
                message: 'Off-grid solar systems cannot be net-metered. Net-metered systems must be connected to the grid.' 
            });
        }
    }
    
    // Validate that Solar Street Lights and Solar Pump cannot be selected for power generation systems
    if (assessment && assessment.solarUsage) {
        const powerGenerationUsages = ['Solar Street Lights', 'Solar Pump'];
        const isPowerGenerationSystem = properties.isNetMetered === 'Yes' || properties.isDer === 'Yes' || properties.ownUse === 'Yes';
        
        if (isPowerGenerationSystem && powerGenerationUsages.includes(assessment.solarUsage)) {
            return res.status(400).json({ 
                message: 'Solar Street Lights and Solar Pump cannot be selected for power generation systems (Net-metered, DER, or Own-use). These systems must use Power Generation.' 
            });
        }
    }

    // Remove establishment type for solar power generation to prevent conflicts with solar subcategories
    if (assessment && assessment.solarUsage === "Power Generation") {
        if (properties.establishmentType) {
            delete properties.establishmentType;
        }
    }

    // Handle files/images - Process them properly with GridFS
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            try {
                const randombytes = crypto.randomBytes(16);
                const filename = randombytes.toString('hex') + '.webp';
                
                // Process image with sharp
                const processedBuffer = await sharp(file.buffer)
                    .rotate()
                    .toFormat('webp')
                    .resize(1080)
                    .webp({ quality: 70 })
                    .toBuffer();
                
                // Upload to GridFS
                const uploadStream = getBucket().openUploadStream(filename, {
                    contentType: 'image/webp'
                });
                
                const fileStream = Readable.from(processedBuffer);
                await new Promise((resolve, reject) => {
                    fileStream.pipe(uploadStream)
                        .on('error', reject)
                        .on('finish', resolve);
                });
                
                images.push(filename);
            } catch (err) {
                console.error('Error processing image:', err);
                // Continue with other images
            }
        }
    }

    if (!forceUpdate) {
        // First, check if coordinates have actually changed from the original inventory
        const originalInventory = await Inventory.findById(id).exec();
        if (!originalInventory) {
            return res.status(400).json({ message: 'Technical assessment not found' });
        }
        
        const originalCoords = originalInventory.coordinates;
        const newCoords = coordArray;
        
        // Check if coordinates are the same (within a small tolerance for floating point precision)
        const coordsUnchanged = (
            originalCoords && 
            newCoords && 
            originalCoords.length === 2 && 
            newCoords.length === 2 &&
            Math.abs(originalCoords[0] - newCoords[0]) < 0.000001 && // ~1 meter precision
            Math.abs(originalCoords[1] - newCoords[1]) < 0.000001
        );
        
        console.log('Coordinate change check:', {
            originalCoords,
            newCoords,
            coordsUnchanged,
            tolerance: 0.000001
        });
        
        // Only check for duplicates if coordinates have actually changed
        if (!coordsUnchanged) {
            // First, let's check if there are any inventories at all and test the spatial index
            const totalInventories = await Inventory.countDocuments();
            console.log('Total inventories in database:', totalInventories);
            
            // Test a simple spatial query to see if the index works
            const testQuery = await Inventory.find({
                coordinates: {
                    $near: {
                        $geometry: geoJsonPoint,
                        $maxDistance: 10000 // 10km for testing
                    }
                }
            }).limit(5).lean();
            
            console.log('Test spatial query (10km radius):', {
                found: testQuery.length,
                sample: testQuery.slice(0, 2).map(inv => ({
                    id: inv._id,
                    coords: inv.coordinates,
                    owner: inv.properties?.ownerName
                }))
            });
            
            const possibleDuplicates = await Inventory.find({
                _id: { $ne: id }, // exclude the inventory being edited
                coordinates: {
                    $near: {
                        $geometry: geoJsonPoint,
                        $maxDistance: DUPLICATE_RADIUS_METERS
                    }
                }
            }).lean();

            console.log('Duplicate detection query:', {
                id,
                geoJsonPoint,
                maxDistance: DUPLICATE_RADIUS_METERS,
                possibleDuplicates: possibleDuplicates?.length || 0
            });

            if (possibleDuplicates && possibleDuplicates.length > 0) {
                return res.status(409).json({
                    message: "Potential duplicate detected",
                    duplicates: possibleDuplicates
                });
            }
        } else {
            console.log('Coordinates unchanged, skipping duplicate detection');
        }
    }

    const inventory = await Inventory.findById(id).exec();
    if (!inventory) {
        return res.status(400).json({ message: 'Technical assessment not found' });
    }

    inventory.user = user;
    inventory.type = type;
    inventory.coordinates = coordArray; // Store as flat array
    console.log('Storing coordinates in database:', coordArray);
    inventory.images = [...(inventory.images || []), ...images];
    inventory.properties.address.country = properties.address.country;
    inventory.properties.address.region = properties.address.region;
    inventory.properties.address.province = properties.address.province;
    inventory.properties.address.city = properties.address.city;
    inventory.properties.address.brgy = properties.address.brgy;
    inventory.properties.ownerName = properties.ownerName;
    inventory.properties.reCat = properties.reCat;
    inventory.properties.reClass = properties.reClass;
    inventory.properties.yearEst = properties.yearEst;
    inventory.properties.acquisition = properties.acquisition;

    if (properties && Object.prototype.hasOwnProperty.call(properties, 'isNetMetered')) {
        inventory.properties.isNetMetered = properties.isNetMetered;
    }
    if (properties && Object.prototype.hasOwnProperty.call(properties, 'isDer')) {
        inventory.properties.isDer = properties.isDer;
    }
    if (properties && Object.prototype.hasOwnProperty.call(properties, 'ownUse')) {
        inventory.properties.ownUse = properties.ownUse;
    }
    // Only save establishment type if not solar power generation (to prevent conflicts with solar subcategories)
    if (properties && Object.prototype.hasOwnProperty.call(properties, 'establishmentType') && 
        (!assessment || assessment.solarUsage !== "Power Generation")) {
        inventory.properties.establishmentType = properties.establishmentType;
    }
    
    // Clear establishment type if solar power generation is selected (to prevent conflicts with solar subcategories)
    if (assessment && assessment.solarUsage === "Power Generation" && inventory.properties.establishmentType) {
        delete inventory.properties.establishmentType;
    }

    // Save FIT only if commercial, else remove
    if (properties.reClass === "Commercial") {
        inventory.properties.fit = properties.fit;
    } else {
        if (inventory.properties.fit) delete inventory.properties.fit;
    }

    inventory.assessment = assessment;

    const updatedInventory = await inventory.save();
    
    // Return the updated inventory data so the frontend can update its cache
    res.json({
        message: `'${updatedInventory.type}' updated`,
        updatedInventory: {
            id: updatedInventory._id,
            coordinates: updatedInventory.coordinates,
            properties: updatedInventory.properties,
            assessment: updatedInventory.assessment,
            user: updatedInventory.user,
            type: updatedInventory.type
        }
    });
};

const deleteImageInventory = async (req, res) => {
    const { images, id } = req.body;
    const inventory = await Inventory.findById(id).exec();
    const prevImages = inventory.images;

    const newImages = prevImages.splice(images, 1);
    inventory.images = prevImages;
    const item = newImages[0];

        const file = await getBucket().find({ filename: item }).toArray();

        if (file.length > 0) {
            await getBucket().delete(file[0]._id);
        const updatedInventory = await inventory.save();
        res.json(`'${updatedInventory.type}' updated`);
    } else {
        console.log('Image file not found.');
    }
};

// @desc Delete a inventory
// @route DELETE /inventories
// @access Private
const deleteInventory = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Inventory ID required' });
    }
    const inventory = id.map(async x =>  {
        const singleInventory = await Inventory.findById(x).exec();
        if (!singleInventory) {
            return res.status(400).json({ message: 'Inventory not found' });
        }
        const prevImages = singleInventory.images;
        await Promise.all(prevImages.map(async file => {
            const documents = await getBucket().find({ filename: file }).toArray();
            if (documents.length > 0) {
                await getBucket().delete(documents[0]._id);
            } else {
                console.log('Image file not found.');
            }
        }));
        await singleInventory.deleteOne();
    });
    const reply = `Inventory deleted`;
    res.json(reply);
};

module.exports = {
    getAllInventories,
    createNewInventory,
    deleteImageInventory,
    updateInventory,
    deleteInventory,
};
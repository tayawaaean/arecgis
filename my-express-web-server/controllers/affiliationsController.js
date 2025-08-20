const Affiliation = require('../models/Affiliation')

// @desc Get all affiliations with pagination
// @route GET /affiliations?page=1&limit=5
// @access Private
const getAllAffiliations = async (req, res) => {
    try {
        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        
        // Get total count for pagination metadata
        const total = await Affiliation.countDocuments();
        
        // Get paginated affiliations
        const affiliations = await Affiliation.find()
            .sort({ name: 1 }) // Sort alphabetically by name (A-Z)
            .skip(skip)
            .limit(limit)
            .lean();
            
        if (!affiliations?.length && page > 1) {
            return res.status(400).json({ message: 'No affiliations found for this page' })
        }
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        const response = {
            data: affiliations,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        };
        
        res.json(response);
    } catch (error) {
        console.error('Error getting affiliations:', error);
        res.status(500).json({ message: 'Error fetching affiliations' });
    }
}

// @desc Create a new affiliation
// @route POST /affiliations
// @access Private
const createNewAffiliation = async (req, res) => {
    const { name, code } = req.body

    // Confirm data
    if (!name || !code) {
        return res.status(400).json({ message: 'Name and code are required' })
    }

    // Check for duplicates
    const duplicate = await Affiliation.findOne({ 
        $or: [
            { name: { $regex: new RegExp(`^${name}$`, 'i') } },
            { code: { $regex: new RegExp(`^${code}$`, 'i') } }
        ]
    }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate affiliation name or code' })
    }

    // Create and store new affiliation
    const affiliation = await Affiliation.create({ name, code: code.toUpperCase() })

    if (affiliation) {
        res.status(201).json({ message: `New affiliation ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid affiliation data received' })
    }
}

// @desc Update an affiliation
// @route PATCH /affiliations
// @access Private
const updateAffiliation = async (req, res) => {
    const { id, name, code, active } = req.body

    // Confirm data
    if (!id || !name || !code || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the affiliation exist to update?
    const affiliation = await Affiliation.findById(id).exec()

    if (!affiliation) {
        return res.status(400).json({ message: 'Affiliation not found' })
    }

    // Check for duplicate
    const duplicate = await Affiliation.findOne({ 
        $or: [
            { name: { $regex: new RegExp(`^${name}$`, 'i') } },
            { code: { $regex: new RegExp(`^${code}$`, 'i') } }
        ]
    }).lean().exec()

    // Allow updates to the original affiliation
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate affiliation name or code' })
    }

    affiliation.name = name
    affiliation.code = code.toUpperCase()
    affiliation.active = active

    const updatedAffiliation = await affiliation.save()

    res.json({ message: `${updatedAffiliation.name} updated` })
}

// Delete functionality removed - affiliations can only be set to active/inactive

module.exports = {
    getAllAffiliations,
    createNewAffiliation,
    updateAffiliation
};

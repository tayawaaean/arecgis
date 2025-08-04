const Inventory = require('../models/Inventory')
const User = require('../models/User') // Make sure to import your User model

const getInventoryList = async (req, res) => {
  try {
    let { page = 1, limit = 100, username, isAdmin = 'false' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit
    
    // Parse boolean from string
    isAdmin = isAdmin === 'true'
    
    let query = {}
    
    // Only filter by username for non-admin users
    if (!isAdmin && username) {
      // First find the user document to get the ID
      const user = await User.findOne({ username }).lean()
      
      if (user) {
        // Filter by user reference ID
        query.user = user._id
      } else {
        // Return empty result if user not found
        return res.json({
          data: [],
          meta: { page, total: 0, limit, totalPages: 0 },
        })
      }
    }

    const total = await Inventory.countDocuments(query)
    const inventories = await Inventory.find(query)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username')
      .lean()
      
    const transformedData = inventories.map(inventory => ({
      ...inventory,
      username: inventory.user?.username
    }))

    res.json({
      data: transformedData,
      meta: {
        page,
        total,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('Error in getInventoryList:', err)
    res.status(500).json({ message: 'Server error while retrieving inventory list' })
  }
}

module.exports = { getInventoryList }
const Inventory = require('../models/Inventory')
const User = require('../models/User')

// Helper function to build query from filters
const buildFilterQuery = (parsedFilters, username, isAdmin) => {
  let query = {}
  
  // Only filter by username for non-admin users
  if (!isAdmin && username) {
    // We'll handle this in the calling function since we need the user ID
  }
  
  // Apply filters from the frontend
  if (parsedFilters.reClass) {
    query['properties.reClass'] = parsedFilters.reClass
  }
  
  // Add other filters as needed
  if (parsedFilters.reCat) {
    query['properties.reCat'] = parsedFilters.reCat
  }
  
  if (parsedFilters.fitEligible) {
    if (parsedFilters.fitEligible === 'Yes') {
      query['properties.fit.eligible'] = { $in: [true, 'true'] }
    } else if (parsedFilters.fitEligible === 'No') {
      query['properties.fit.eligible'] = { $in: [false, 'false'] }
    }
  }
  
  if (parsedFilters.fitPhase) {
    query['properties.fit.phase'] = parsedFilters.fitPhase
  }
  
  if (parsedFilters.isNetMetered) {
    if (parsedFilters.isNetMetered === 'Yes') {
      query['properties.isNetMetered'] = { $in: [true, 'true'] }
    } else if (parsedFilters.isNetMetered === 'No') {
      query['properties.isNetMetered'] = { $in: [false, 'false'] }
    }
  }
  
  if (parsedFilters.ownUse) {
    if (parsedFilters.ownUse === 'Yes') {
      query['properties.ownUse'] = { $in: [true, 'true'] }
    } else if (parsedFilters.ownUse === 'No') {
      query['properties.ownUse'] = { $in: [false, 'false'] }
    }
  }
  
  if (parsedFilters.solarSystemTypes) {
    query['assessment.solarSystemTypes'] = parsedFilters.solarSystemTypes
  }
  
  if (parsedFilters.status) {
    query['assessment.status'] = parsedFilters.status
  }
  
  if (parsedFilters.quickSearch) {
    const searchTerm = parsedFilters.quickSearch;
    query['$or'] = [
      // Search in address fields
      { 'properties.address.city': { $regex: searchTerm, $options: 'i' } },
      { 'properties.address.brgy': { $regex: searchTerm, $options: 'i' } },
      { 'properties.address.province': { $regex: searchTerm, $options: 'i' } },
      { 'properties.address.region': { $regex: searchTerm, $options: 'i' } },
      // Search in owner name
      { 'properties.ownerName': { $regex: searchTerm, $options: 'i' } },
      // Search in RE Category (Wind Energy, Biomass, etc.)
      { 'properties.reCat': { $regex: searchTerm, $options: 'i' } },
      // Search in RE Classification
      { 'properties.reClass': { $regex: searchTerm, $options: 'i' } },
      // Search in assessment status
      { 'assessment.status': { $regex: searchTerm, $options: 'i' } },
      // Search in solar usage types
      { 'assessment.solarUsage': { $regex: searchTerm, $options: 'i' } },
      // Search in wind usage types
      { 'assessment.windUsage': { $regex: searchTerm, $options: 'i' } },
      // Search in biomass usage types
      { 'assessment.biomassPriUsage': { $regex: searchTerm, $options: 'i' } },
      // Search in username (uploader)
      { 'username': { $regex: searchTerm, $options: 'i' } }
    ];
  }
  
  return query
}

const getInventoryList = async (req, res) => {
  try {
    let { 
      page = 1, 
      limit = 20, 
      username, 
      isAdmin = 'false',
      filters = '{}'  // New parameter to receive filters as JSON string
    } = req.query
    
    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit
    isAdmin = isAdmin === 'true'
    
    // Parse filters from JSON string
    let parsedFilters = {}
    try {
      parsedFilters = JSON.parse(filters)
    } catch (e) {
      console.error('Error parsing filters:', e)
    }
    
    let query = buildFilterQuery(parsedFilters, username, isAdmin)
    
    // Only filter by username for non-admin users
    if (!isAdmin && username) {
      const user = await User.findOne({ username }).lean()
      
      if (user) {
        // Modified query to include inventories where the user is either:
        // 1. The current owner (user field)
        // 2. A previous owner (in previousUsers array)
        query['$or'] = [
          { user: user._id },
          { previousUsers: user._id }
        ]
      } else {
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
      .populate('previousUsers', 'username') // Also populate previousUsers to access usernames
      .lean()
      
    // Transform data to include previous users information
    const transformedData = inventories.map(inventory => ({
      ...inventory,
      username: inventory.user?.username,
      previousUsernames: inventory.previousUsers?.map(prevUser => prevUser.username) || [],
      // Add a flag to easily identify if current user is previous owner
      isCurrentOwner: inventory.user?.username === username,
      isPreviousOwner: inventory.previousUsers?.some(prevUser => prevUser.username === username) || false
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

// Get a single inventory by ID - if you need this endpoint
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params
    const { username, isAdmin } = req.query
    
    // Find the inventory by ID
    const inventory = await Inventory.findById(id)
      .populate('user', 'username')
      .populate('previousUsers', 'username')
      .lean()
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' })
    }
    
    // If not admin, verify access rights
    if (isAdmin !== 'true') {
      const user = await User.findOne({ username }).lean()
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }
      
      const isCurrentOwner = inventory.user?._id.toString() === user._id.toString()
      const isPreviousOwner = inventory.previousUsers?.some(
        prevUser => prevUser._id.toString() === user._id.toString()
      )
      
      if (!isCurrentOwner && !isPreviousOwner) {
        return res.status(403).json({ message: 'Access denied' })
      }
      
      // Add user relationship info
      inventory.userRelationship = isCurrentOwner ? 'current_owner' : 'previous_owner'
    } else {
      inventory.userRelationship = 'admin_access'
    }
    
    res.json(inventory)
  } catch (err) {
    console.error('Error in getInventoryById:', err)
    res.status(500).json({ message: 'Server error while retrieving inventory' })
  }
}

// Get inventory summary (all inventories for calculations)
const getInventoryListSummary = async (req, res) => {
  try {
    let { 
      username, 
      isAdmin = 'false',
      filters = '{}'  // New parameter to receive filters as JSON string
    } = req.query
    
    isAdmin = isAdmin === 'true'
    
    // Parse filters from JSON string
    let parsedFilters = {}
    try {
      parsedFilters = JSON.parse(filters)
    } catch (e) {
      console.error('Error parsing filters:', e)
    }
    
    let query = buildFilterQuery(parsedFilters, username, isAdmin)
    
    // Only filter by username for non-admin users
    if (!isAdmin && username) {
      const user = await User.findOne({ username }).lean()
      
      if (user) {
        // Modified query to include inventories where the user is either:
        // 1. The current owner (user field)
        // 2. A previous owner (in previousUsers array)
        query['$or'] = [
          { user: user._id },
          { previousUsers: user._id }
        ]
      } else {
        return res.json({
          data: [],
        })
      }
    }

    // Get ALL inventories matching the filter (no pagination)
    const inventories = await Inventory.find(query)
      .populate('user', 'username')
      .populate('previousUsers', 'username')
      .lean()
      
    // Transform data to include previous users information
    const transformedData = inventories.map(inventory => ({
      ...inventory,
      username: inventory.user?.username,
      previousUsernames: inventory.previousUsers?.map(prevUser => prevUser.username) || [],
      // Add a flag to easily identify if current user is previous owner
      isCurrentOwner: inventory.user?.username === username,
      isPreviousOwner: inventory.previousUsers?.some(prevUser => prevUser.username === username) || false
    }))

    res.json({
      data: transformedData,
    })
  } catch (err) {
    console.error('Error in getInventoryListSummary:', err)
    res.status(500).json({ message: 'Server error while retrieving inventory summary' })
  }
}

module.exports = { 
  getInventoryList,
  getInventoryById,
  getInventoryListSummary
}
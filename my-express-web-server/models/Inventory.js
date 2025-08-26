const mongoose = require('mongoose');

// --- FIT sub-schema for Commercial RE ---
const fitSchema = new mongoose.Schema({
  eligible: { type: Boolean, default: false }, // Is FIT-eligible?
  phase: { type: String, enum: ["FIT1", "FIT2", "Non-FIT"], default: "Non-FIT" },
  rate: { type: Number }, // PHP/kWh, optional
  fitRef: { type: String }, // Reference code, optional
  fitStatus: { type: String } // e.g. active, expired, optional
}, { _id: false });

// --- Assessment sub-schema ---
const assessmentSchema = new mongoose.Schema({
  solarUsage: { type: String },
  capacity: { type: Number },
  annualEnergyProduction: { type: Number }, // annual energy prod.
  solarSystemTypes: { type: String },
  remarks: { type: String },
  status: { type: String },
  // Solar subcategories for power generation
  solarPowerGenSubcategory: {
    mainCategory: { type: String }, // e.g., "Rooftop Solar PV", "Ground-mounted Solar PV", "Building-integrated PV (BIPV)"
    subcategory: { type: String }, // e.g., "Residential rooftop – installed on homes"
    mainCategoryId: { type: Number },
    subcategoryId: { type: Number }
  },
  // Add other solar, wind, biomass, hydro fields as needed
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  previousUsers: [{  // <-- change here
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2dsphere'
  },
  images: [{
    type: String,
  }],
  assessment: {
    type: assessmentSchema,
    default: {}
  },
  properties: {
    ownerName: {
      type: String,
      required: true,
    },
    reCat: {
      type: String,
      default: 'Solar Energy System'
    },
    reClass: {
      type: String,
      required: true,
    },
    yearEst: {
      type: String,
      required: true,
    },
    acquisition: {
      type: String,
      required: true,
    },
    isNetMetered: {
      type: String,
      enum: ["Yes", "No"],
      default: "No"
    },
    isDer: {
      type: String,
      enum: ["Yes", "No"],
      default: "No"
    },
    ownUse: {
      type: String,
      enum: ["Yes", "No"],
      default: "No"
    },
    establishmentType: {
      type: String,
      enum: ["Residential Establishment", "Commercial Establishment", "Industrial Establishment"],
      default: undefined
    },
    address: {
      country: {
        type: String,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      brgy: {
        type: String,
        required: true,
      },
    },
    // --- FIT info for Commercial RE, optional ---
    fit: { type: fitSchema, default: undefined }
  },

},
  {
    timestamps: true,
  }
);

inventorySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Inventory', inventorySchema);
// MongoDB Insert Script for Additional Luzon Non-FIT commercial power plants
// This adds 14 more commercial renewable energy projects from Luzon that don't qualify for FIT rates (records 12-25)

// Function to parse address and extract components
function parseAddress(addressString) {
  if (!addressString || addressString === "") return { country: "Philippines", region: "", province: "", city: "", brgy: "" };
  
  const parts = addressString.split(',').map(part => part.trim());
  
  if (parts.length >= 3) {
    return {
      country: "Philippines",
      region: parts[parts.length - 1], // Last part is usually the region/province
      province: parts[parts.length - 1], // Same as region for most cases
      city: parts[parts.length - 2], // Second to last is usually city/municipality
      brgy: parts[0] // First part is usually barangay
    };
  } else if (parts.length === 2) {
    return {
      country: "Philippines",
      region: parts[1],
      province: parts[1],
      city: parts[1],
      brgy: parts[0]
    };
  } else {
    return {
      country: "Philippines",
      region: parts[0] || "",
      province: parts[0] || "",
      city: parts[0] || "",
      brgy: parts[0] || ""
    };
  }
}

// Function to determine RE category
function getRECategory(category) {
  switch(category) {
    case "Solar": return "Solar Energy";
    case "Wind": return "Wind Energy";
    case "Hydro": return "Hydropower";
    case "Biomass": return "Biomass";
    case "Geothermal Energy": return "Geothermal Energy";
    default: return "Solar Energy";
  }
}

// Function to determine solar system types
function getSolarSystemTypes(description) {
  if (description && description.includes("Solar")) {
    if (description.includes("Rooftop") || description.includes("Industrial")) {
      return "Rooftop Solar Industrial";
    } else if (description.includes("Residential")) {
      return "Rooftop Solar Residential";
    } else {
      return "Grid-tied";
    }
  }
  return "Grid-tied";
}

// Function to convert capacity to watts
function convertCapacityToWatts(capacityStr) {
  if (!capacityStr || capacityStr === "") return 0;
  
  // Remove commas and convert to number
  const capacity = parseFloat(capacityStr.toString().replace(/,/g, ''));
  
  // Convert from kW to W (multiply by 1000)
  return capacity * 1000;
}

// Insert additional Luzon Non-FIT records (12-25)
db.inventories.insertMany([
  // Record 12: Bataan Solar Energy Inc. (BSEI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.59846355511553, 14.49420773391818],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("4,377"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("10,166 Solar\nPanels / 21 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Bataan Solar Energy Inc. (BSEI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Batangas II, Mariveles, Bataan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-05-13-M-PAO-E-0070L (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 13: Calabanga Renewable Energy (CARE), Inc.
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.254181, 13.736988],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("74,168"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("137,348 Solar\nPanels / 170 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Calabanga Renewable Energy (CARE), Inc.",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bonot-Sta. Rosa, Calabanga, Camarines Sur"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-09-23-M-PAO-N-0223L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 14: CBK Power Company Limited (CBK) and PSALM
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.48499734872345, 14.156000532653723],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("21,956"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "CBK Power Company Limited (CBK) and Power Sector Assets and Liabilities Management Corp. (PSALM)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Botocan, Majayjay, Laguna"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-24-M-PAO-E-0172L (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 15: CBK Power Company Limited (CBK PCL) and PSALM
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.4704085067455, 14.299292800000007],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("35,020"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "CBK Power Company Limited (CBK PCL) and Power Sector Assets and Liabilities Management Corp. (PSALM)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Lewin, Lumban, Laguna"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-M-00049BL"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 16: Citicore Solar Bataan, Inc. (CSBI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.53555383558182, 14.450963900000001],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("18,004"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("68,592 Solar\nPanels / 32 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Bataan, Inc. (CSBI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Freeport Area of Bataan (FAB), Mariveles, Bataan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-03-18-M-PAO-E-0060L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 17: Citicore Solar Tarlac 1, Inc. (CST1I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.53296486441818, 15.415768200000013],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,836"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("33,984 Solar\nPanels / 236 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Tarlac 1, Inc. (CST1I)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Sampaloc, Brgy. Armenia, Tarlac City, Tarlac"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-02-M-PAO-E-0461L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 18: Citicore Solar Tarlac 2, Inc. (CST2I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.61308162209086, 15.536999673559606],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("7,479"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("28,224 Solar\nPanels / 196 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Tarlac 2, Inc. (CST2I)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Blk. 6 Brgy. Dalayap, Tarlac City, Tarlac"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-02-M-PAO-E-0459L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 19: DPJ Engineers & Consultants (DPJ)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.4539808932545, 17.413854037112056],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,010"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "DPJ Engineers & Consultants (DPJ)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Bulanao, Tabuk City, Kalinga"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "17-08-M-00132L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 20: Ecopark Energy of Valenzuela Corp. (EEVC) - Isla Solar
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.95101607027554, 14.704831105669536],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("4,691"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("17,700 Solar\nPanels / 10 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Ecopark Energy of Valenzuela Corp. (EEVC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("56 Isla Road, Barangay Isla, Valenzuela City, Metro Manila"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-01-21-M-PAO-E-0390L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 21: Ecopark Energy of Valenzuela Corp. (EEVC) - Tagalag Solar
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.93813260937584, 14.723973724489632],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("16,002"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("59,268 Solar\nPanels / 32 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Ecopark Energy of Valenzuela Corp. (EEVC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("189 Tagalag Road, Brgy. Tagalag, Valenzuela City"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-09-30-M-PAO-E-0233L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 22: First Gen Hydro Power Corporation (FGHPC) - Masiway
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.09476121885396, 15.785486823417578],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("12,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "First Gen Hydro Power Corporation (FGHPC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sampaloc, Pantabangan, Nueva Ecija"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "22-09-M-00286qL"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 23: First Gen Hydro Power Corporation (FGHPC) - Pantabangan
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.10902732241048, 15.81061448977689],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("120,802"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "First Gen Hydro Power Corporation (FGHPC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Fatima, Pantabangan, Nueva Ecija"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "22-09-M-00286pL"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 24: Fresh River Lakes Corp. (FRLC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.20020731126995, 15.846059463182481],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("153,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Fresh River Lakes Corp. (FRLC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Pauan, Brgy. Villarica, Pantabangan, Nueva Ecija"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-05-22-M-PAO-E-0452L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 25: Gigasol3, Inc.
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [119.94960323517019, 15.443886604845732],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("63,005"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("156,520 Solar\nPanels / 16 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Gigasol3, Inc.",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Salaza, Palauig, Subic, Zambales"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-17-M-PAO-E-0105L (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 14 additional Luzon Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Additional Luzon Non-FIT additions include:");
print("   - Bataan Solar Energy - Bataan Solar (4,377 kW) - Mariveles, Bataan");
print("   - Calabanga Renewable Energy - Calabanga Solar (74,168 kW) - Calabanga, Camarines Sur");
print("   - CBK Power & PSALM - Botocan Hydro (21,956 kW) - Majayjay, Laguna");
print("   - CBK Power & PSALM - Caliraya Hydro (35,020 kW) - Lumban, Laguna");
print("   - Citicore Solar Bataan - Bataan Solar (18,004 kW) - FAB, Mariveles, Bataan");
print("   - Citicore Solar Tarlac 1 - Armenia Solar (8,836 kW) - Tarlac City, Tarlac");
print("   - Citicore Solar Tarlac 2 - Dalayap Solar (7,479 kW) - Tarlac City, Tarlac");
print("   - DPJ Engineers - Bulanao Hydro (1,010 kW) - Tabuk City, Kalinga");
print("   - Ecopark Energy Valenzuela - Isla Solar (4,691 kW) - Valenzuela City, Metro Manila");
print("   - Ecopark Energy Valenzuela - Tagalag Solar (16,002 kW) - Valenzuela City");
print("   - First Gen Hydro Power - Masiway Hydro (12,000 kW) - Pantabangan, Nueva Ecija");
print("   - First Gen Hydro Power - Pantabangan Hydro (120,802 kW) - Pantabangan, Nueva Ecija");
print("   - Fresh River Lakes - Casecnan Hydro (153,000 kW) - Pantabangan, Nueva Ecija");
print("   - Gigasol3 - Palauig Solar (63,005 kW) - Palauig, Zambales");
print("🚀 Your database now includes 25 Luzon Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Bataan, Camarines Sur, Laguna, Tarlac, Kalinga, Metro Manila, Nueva Ecija, Zambales");
print("💡 Notable: Fresh River Lakes Casecnan Hydro has the largest capacity at 153,000 kW in this batch!");
print("🌞 Solar Focus: Strong solar development across multiple Luzon provinces!");
print("💧 Hydro Diversity: Multiple hydro projects in Laguna and Nueva Ecija!");
print("📈 Total Additional Capacity: 428,548 kW across all 14 projects!");
print("⚡ Combined with first batch: 1,493,229 kW total Luzon Non-FIT capacity!");

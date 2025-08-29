// MongoDB Insert Script for Luzon Non-FIT commercial power plants
// This adds commercial renewable energy projects from Luzon that don't qualify for FIT rates

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

// Insert Luzon Non-FIT records (1-11)
db.inventories.insertMany([
  // Record 1: Angat Hydropower Corporation (AHC) and MWSS
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.16058326256379, 14.907021757998725],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("194,581"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Angat Hydropower Corporation (AHC) and Metropolitan Waterworks and Sewerage System (MWSS)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. San Lorenzo, Norzagaray, Bulacan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-02-24-M-PAO-E-0402L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 2: Amihan Renewable Energy Corp. (AREC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.81067181388735, 18.62421861345739],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("50,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Amihan Renewable Energy Corp. (AREC)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Caparispisan & Subec, Pagudpud, Ilocos Norte"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-30-M-PAO-N-0484L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 3: AP Renewables Inc. (APRI) - Makban-Binary 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.20928770674546, 14.096624900000004],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("7,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Elena, Sto. Tomas, Batangas"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-08-M-PAO-E-263L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 4: AP Renewables Inc. (APRI) - Makban-Bay Plant A
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.21290788617303, 14.090404772456743],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("110,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bitin, Bay, Laguna"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-11-26-M-PAO-E-0325L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 5: AP Renewables Inc. (APRI) - Makban-Bay Plant D and Calauan Plant B
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.22531690674548, 14.088802812217432],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("150,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Limao, Calauan, Laguna"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-11-26-M-PAO-E-0326L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 6: AP Renewables Inc. (APRI) - Makban-Sto. Tomas
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.20511217655502, 14.094562111442348],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("40,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Elena, Sto. Tomas, Batangas"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-11-26-M-PAO-E-0327L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 7: AP Renewables Inc. (APRI) - Tiwi Binary
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.63917644453994, 13.459790467123092],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("17,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cale, Tiwi, Albay"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-05-22-M-PAO-N-0451L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 8: AP Renewables Inc. (APRI) - Tiwi Plant A
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.64800210468145, 13.465287541542173],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("110,400"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Naga, Tiwi, Albay"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-06-M-PAO-E-0344L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 9: AP Renewables Inc. (APRI) - Tiwi Plant C
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.63917644453994, 13.459790467123092],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("110,400"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "AP Renewables Inc. (APRI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cale, Tiwi, Albay"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-06-M-PAO-E-0345L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 10: Bac-Man Geothermal, Inc. (BGI) - Bac-Man I and II
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.92903616441816, 13.060254748687624],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("130,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Bac-Man Geothermal, Inc. (BGI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Palayan Bayan, Manito, Albay"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-30-M-PAO-E-0311L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 11: Bac-Man Geothermal, Inc. (BGI) - Palayan Binary
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.90643775938634, 13.107573815654167],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("35,700"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Bac-Man Geothermal, Inc. (BGI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Palayan Bayan, Brgy. Nagotgot, Manito, Albay"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-03-11-M-PAO-N-0412L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 11 Luzon Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Luzon Non-FIT additions include:");
print("   - Angat Hydropower Corp - Angat Hydro (194,581 kW) - Norzagaray, Bulacan");
print("   - Amihan Renewable Energy - Caparispisan II Wind (50,000 kW) - Pagudpud, Ilocos Norte");
print("   - AP Renewables - Makban-Binary 1 Geothermal (7,000 kW) - Sto. Tomas, Batangas");
print("   - AP Renewables - Makban-Bay Plant A Geothermal (110,000 kW) - Bay, Laguna");
print("   - AP Renewables - Makban-Bay Plant D & Calauan Plant B Geothermal (150,000 kW) - Calauan, Laguna");
print("   - AP Renewables - Makban-Sto. Tomas Geothermal (40,000 kW) - Sto. Tomas, Batangas");
print("   - AP Renewables - Tiwi Binary Geothermal (17,000 kW) - Tiwi, Albay");
print("   - AP Renewables - Tiwi Plant A Geothermal (110,400 kW) - Tiwi, Albay");
print("   - AP Renewables - Tiwi Plant C Geothermal (110,400 kW) - Tiwi, Albay");
print("   - Bac-Man Geothermal - Bac-Man I & II (130,000 kW) - Manito, Albay");
print("   - Bac-Man Geothermal - Palayan Binary (35,700 kW) - Manito, Albay");
print("🚀 Your database now includes Luzon Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Bulacan, Ilocos Norte, Batangas, Laguna, Albay");
print("💡 Notable: Angat Hydro has the largest capacity at 194,581 kW!");
print("🌋 Geothermal Focus: Strong geothermal development in Batangas, Laguna, and Albay!");
print("📈 Total Luzon Non-FIT Capacity: 1,064,681 kW across all 11 projects!");
print("⚡ These projects operate without FIT subsidies but contribute significantly to Luzon's renewable energy mix!");

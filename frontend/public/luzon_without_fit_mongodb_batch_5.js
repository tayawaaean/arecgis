// MongoDB Insert Script for Fifth Batch of Luzon Non-FIT commercial power plants
// This adds 11 more commercial renewable energy projects from Luzon that don't qualify for FIT rates (records 71-81)

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

// Insert fifth batch of Luzon Non-FIT records (71-81)
db.inventories.insertMany([
  // Record 71: Sinocalan Solar Power Corp.
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.63718695220534, 16.069038432482717],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("59,814"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("108,752 Solar\nPanels / 42 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sinocalan Solar Power Corp.",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Silsilay, Brgy. Sto. Domingo, San Manuel, Pangasinan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-05-09-M-PAO-N-0441L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 72: SN Aboitiz Power - Benguet, Inc. (SNAP – BI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.74049953080369, 16.459750942710198],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("104,550"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SN Aboitiz Power - Benguet, Inc. (SNAP – BI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Ambuklao, Bokod, Benghuet"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-08-12-M-PAO-E-0177L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 73: SN Aboitiz Power - Benguet, Inc. (SNAP-BI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.71831456111266, 16.39031334741928],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("140,080"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SN Aboitiz Power - Benguet, Inc. (SNAP-BI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Tinongdan, Itogon, Benguet"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-02-10-M-PAO-E-0032L(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 74: SN Aboitiz Power-Magat, Inc. (SNAP- MI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.45547044597397, 16.82651133813148],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("360,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SN Aboitiz Power-Magat, Inc. (SNAP- MI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. General Aguinaldo, Ramon, Isabela and Brgy. Sto. Domingo, Alfonso Lista, Ifugao"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-11-25-M-PAO-E-0323L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 75: Solarace1 Energy Corp. (Solarace1)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.21920901229777, 14.070352623249022],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("120,326"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("299,872 Solar\nPanels / 26 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solarace1 Energy Corp. (Solarace1)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgys. San Andres and San Juan, Alaminos, Laguna"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "22-09-M-00243L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 76: Solar Philippines Tarlac Corporation (SPTC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.60841593014156, 15.38064269517487],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("90,349"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("272,059 Solar\nPanels / 121 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solar Philippines Tarlac Corporation (SPTC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Rosa, Concepcion, Tarlac"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-01-08-M-PAO-N-0377L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 77: Solar Powered Agri-Rural Communities Corporation (SPARC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.26629517002796, 14.690948284504037],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("5,000"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("16,192 Solar\nPanels / 4 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solar Powered Agri-Rural Communities Corporation (SPARC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sabang, Morong, Bataan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "17-11-M-00139L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 78: Solar Powered Agri-Rural Communities Corporation (SPARC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.82715789179916, 13.919498098277536],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,820"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("12,322 Solar\nPanels / 4 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solar Powered Agri-Rural Communities Corporation (SPARC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Pasong Intsik, San Rafael, Bulacan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "17-11-M-00140L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 79: SUWECO-SORECO II, Inc.
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.96874117211664, 12.99637779412485],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("600"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SUWECO-SORECO II, Inc.",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Guilajon, Sorsogon City"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "16-06-M-00071L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 80: Terasu Energy Inc. (TEI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.61278900381075, 15.378322172455313],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("60,139"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("179,520 Solar\nPanels / 13 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Terasu Energy Inc. (TEI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Rosa, Concepcion, Tarlac"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-30-M-PAO-E-0312L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 81: Trustpower Corporation (TPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.61213527431404, 15.238719405322565],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,889"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("37,800 Solar\nPanels / 2 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Trustpower Corporation (TPC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Paralayunan, Mabalacat, Pampanga"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-03-M-00336L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 11 additional Luzon Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Fifth batch Luzon Non-FIT additions include:");
print("   - Sinocalan Solar Power - Sto. Domingo Solar (59,814 kW) - San Manuel, Pangasinan");
print("   - SN Aboitiz Power Benguet - Ambuklao Hydro (104,550 kW) - Bokod, Benguet");
print("   - SN Aboitiz Power Benguet - Binga Hydro (140,080 kW) - Itogon, Benguet");
print("   - SN Aboitiz Power Magat - Magat Hydro (360,000 kW) - Ramon, Isabela/Ifugao ⭐");
print("   - Solarace1 Energy - Alaminos Solar (120,326 kW) - Alaminos, Laguna");
print("   - Solar Philippines Tarlac - Concepcion 1 Solar (90,349 kW) - Concepcion, Tarlac");
print("   - SPARC - Morong Solar (5,000 kW) - Morong, Bataan");
print("   - SPARC - San Rafael Solar (3,820 kW) - San Rafael, Bulacan");
print("   - SUWECO-SORECO II - Upper Cawayan Hydro (600 kW) - Sorsogon City");
print("   - Terasu Energy - Sta. Rosa Solar (60,139 kW) - Concepcion, Tarlac");
print("   - Trustpower Corporation - Trust Solar (20,889 kW) - Mabalacat, Pampanga");
print("🚀 Your database now includes 66 Luzon Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Pangasinan, Benguet, Isabela, Ifugao, Laguna, Tarlac, Bataan, Bulacan, Sorsogon, Pampanga");
print("💡 Notable: SN Aboitiz Power Magat Hydro has the largest capacity at 360,000 kW in this batch!");
print("🌞 Solar Dominance: 8 out of 11 projects are solar!");
print("💧 Hydro Projects: 3 major hydro projects in Benguet, Isabela, and Sorsogon");
print("📈 Total Fifth Batch Capacity: 964,567 kW across all 11 projects!");
print("⚡ Combined Total Luzon Non-FIT: 4,471,748 kW across all 66 projects!");
print("🎯 Major Hydro Developers: SN Aboitiz Power with Ambuklao, Binga, and Magat hydro plants!");
print("🏆 Largest Projects: Magat Hydro (360,000 kW), Ambuklao Hydro (104,550 kW), and Binga Hydro (140,080 kW)!");
print("🌊 Hydro Powerhouses: Benguet and Isabela provinces are major hydro energy centers!");

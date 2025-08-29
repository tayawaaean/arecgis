// MongoDB Insert Script for Off-Grid Luzon power plants
// This adds off-grid renewable energy projects from Luzon that provide power to remote areas not connected to the main grid

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
    case "Geothermal": return "Geothermal Energy";
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

// Insert Off-Grid Luzon records
db.inventories.insertMany([
  // Record 1: Cantingas Mini-Hydro Power Corporation (CHPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.5792863, 12.326991388883908],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,350"),
      "annualEnergyProduction": 8017.853,
      "remarks": "Off-Grid Luzon - Romblon",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Cantingas Mini-Hydro Power Corporation (CHPC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Taclobo, San Fernando, Romblon"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "25-07-01-O-PAO-E-0477L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 2: Catuiran Hydropower Corporation (CHC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.09983001743275, 13.215620539936662],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,000"),
      "annualEnergyProduction": 43167.46,
      "remarks": "Off-Grid Luzon - Oriental Mindoro",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Catuiran Hydropower Corporation (CHC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Malvar, Naujan, Oriental Mindoro"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "24-09-04-O-PAO-E-0213L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 3: National Power Corporation (NPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.29657350279471, 13.624408733485671],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,800"),
      "annualEnergyProduction": 5773.712,
      "remarks": "Off-Grid Luzon - Catanduanes",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "National Power Corporation (NPC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Balongbong, Brgy. Sibacungan, Bato, Catanduanes"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "22-09-O-13920-06L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 4: Oriental Mindoro Electric Cooperative, Inc. (ORMECO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.9747442642314, 13.37468154012773],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,175"),
      "annualEnergyProduction": 5421.179,
      "remarks": "Off-Grid Luzon - Oriental Mindoro (Lower Cascade)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Oriental Mindoro Electric Cooperative, Inc. (ORMECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Calangatan, San Teodoro, Oriental Mindoro"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "23-07-O-00012L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 5: Oriental Mindoro Electric Cooperative, Inc. (ORMECO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.97157012127295, 13.378538428857077],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,000"),
      "annualEnergyProduction": 7247.989,
      "remarks": "Off-Grid Luzon - Oriental Mindoro (Upper Cascade)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Oriental Mindoro Electric Cooperative, Inc. (ORMECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Caagutayan, San Teodoro, Oriental Mindoro"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "22-04-O-00092L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 6: Ormin Power Inc. (OPI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.91792820274964, 13.353767983156084],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("9,999"),
      "annualEnergyProduction": 47400.57,
      "remarks": "Off-Grid Luzon - Oriental Mindoro",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Ormin Power Inc. (OPI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Inabasan, Brgy. Caagutayan, San Teodoro, Oriental Mindoro"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "25-07-07-O-PAO-E-0066L (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 7: Romblon Electric Cooperative, Inc (ROMELCO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.26353863070882, 12.57127553590027],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts(975),
      "annualEnergyProduction": 0,
      "remarks": "Off-Grid Luzon - Romblon (Wind Power)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Romblon Electric Cooperative, Inc (ROMELCO)",
      "reCat": getRECategory("Wind"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Lonos, Agnay and Bagacay, Romblon, Romblon"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "25-04-30-O-PAO-N-0440L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 8: Sunwest Water and Electric Company, Inc. (SUWECO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.15300849183141, 13.759385121745687],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,500"),
      "annualEnergyProduction": 4272.8,
      "remarks": "Off-Grid Luzon - Catanduanes (Hitoma 1)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sunwest Water and Electric Company, Inc. (SUWECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Obi, Caramoran, Catanduanes"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "24-07-19-O-PAO-E-0153L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 9: Sunwest Water and Electric Company, Inc. (SUWECO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.29741037866147, 13.653496097978026],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,100"),
      "annualEnergyProduction": 6865.397,
      "remarks": "Off-Grid Luzon - Catanduanes (Solong)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sunwest Water and Electric Company, Inc. (SUWECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Sayaw, Brgy. Solong, San Miguel Catanduanes"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "24-07-19-O-PAO-E-0154L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 10: SUWECO Tablas Energy Corporation (STEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.02261224411644, 12.435402256173287],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("7,540"),
      "annualEnergyProduction": 12946.892,
      "solarSystemTypes": getSolarSystemTypes("23,520 Solar\nPanels / 98 Inverters"),
      "remarks": "Off-Grid Luzon - Romblon (7.54 MWp)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SUWECO Tablas Energy Corporation (STEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Tuminglad, Odiongan, Romblon"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "20-02-O-00151L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 11: SUWECO Tablas Energy Corporation (STEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.02261224411644, 12.435402256173287],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,733"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("5,814 Solar\nPanels / 34 Inverters"),
      "remarks": "Off-Grid Luzon - Romblon (2.733 MW)",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SUWECO Tablas Energy Corporation (STEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Off-Grid",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Canlumay, Barangay Tumingad, Odiongan, Romblon"),
      "fit": {
        "eligible": false,
        "phase": "Off-Grid",
        "fitRef": "24-08-05-O-PAO-E-0175L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 11 Off-Grid Luzon power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Off-Grid Luzon additions include:");
print("   - Cantingas Mini-Hydro Power - Cantingas Mini-Hydro (1,350 kW) - Romblon 💧");
print("   - Catuiran Hydropower - Catuiran Hydroelectric (8,000 kW) - Oriental Mindoro 💧");
print("   - NPC - Balongbong Hydroelectric (1,800 kW) - Catanduanes 💧");
print("   - ORMECO - Linao Cawayan Mini Hydro Lower Cascade (2,175 kW) - Oriental Mindoro 💧");
print("   - ORMECO - Linao Cawayan Mini Hydro Upper Cascade (3,000 kW) - Oriental Mindoro 💧");
print("   - Ormin Power - Inabasan Mini-Hydro (9,999 kW) - Oriental Mindoro 💧");
print("   - ROMELCO - Romblon Wind Power (975 kW) - Romblon 💨");
print("   - SUWECO - Hitoma 1 Mini Hydroelectric (1,500 kW) - Catanduanes 💧");
print("   - SUWECO - Solong Mini Hydroelectric (2,100 kW) - Catanduanes 💧");
print("   - STEC - Tumingad Solar Power Plant 7.54 MWp (7,540 kW) - Romblon");
print("   - STEC - Tumingad Solar Power Plant 2.733 MW (2,733 kW) - Romblon");
print("🚀 Your database now includes 11 Off-Grid Luzon renewable energy projects!");
print("🌍 Geographic Coverage: Romblon, Oriental Mindoro, Catanduanes");
print("💡 Notable: These are off-grid projects providing power to remote island communities!");
print("🌞 Solar Projects: 2 major solar projects in Romblon (10,273 kW total)!");
print("💧 Hydro Projects: 8 major hydro projects across multiple provinces!");
print("💨 Wind Project: 1 wind power project in Romblon!");
print("📈 Total Off-Grid Luzon Capacity: 41,172 kW across all 11 projects!");
print("⚡ Combined Total Luzon: FIT + Non-FIT + Off-Grid projects!");
print("🎯 Major Developers: SUWECO/STEC (solar/hydro), ORMECO (hydro), various independent companies!");
print("🏆 Largest Projects: STEC Tumingad Solar 7.54 MWp (7,540 kW), Ormin Power Inabasan Mini-Hydro (9,999 kW)!");
print("🌊 Energy Diversity: Solar, Hydro, and Wind all represented in Off-Grid Luzon!");
print("🏝️ Island Power: Major projects serving Romblon, Oriental Mindoro, and Catanduanes!");
print("💡 Off-Grid Significance: These projects are crucial for powering remote island communities!");
print("🌍 Remote Access: Providing renewable energy to areas not connected to the main Luzon grid!");

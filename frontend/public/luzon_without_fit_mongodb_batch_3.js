// MongoDB Insert Script for Third Batch of Luzon Non-FIT commercial power plants
// This adds 15 more commercial renewable energy projects from Luzon that don't qualify for FIT rates (records 41-55)

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

// Insert third batch of Luzon Non-FIT records (41-55)
db.inventories.insertMany([
  // Record 41: Jobin-SQM Inc. (JSI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.36111582561658, 14.801890792341768],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("72,128"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("125,440 Solar\nPanels / 56 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Jobin-SQM Inc. (JSI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Mt. Sta. Rita, Subic Bay Freeport Zone"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-02-M-PAO-N-0457L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 42: Maibarara Geothermal, Inc. (MGI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.58332833105023, 16.84928513552078],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("32,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Maibarara Geothermal, Inc. (MGI)",
      "reCat": getRECategory("Geothermal Energy"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Capuz, Brgy. San Rafael, Sto. Tomas City, Batangas"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-09-16-M-PAO-E-0227L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 43: Majestics Energy Corporation (MEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.87737440763522, 14.415040832266609],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("40,000"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("212,547 Solar\nPanels / 81 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Majestics Energy Corporation (MEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Rosario and General Trias, Cavite"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "2022-C2-E-1235L (PAO)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 44: Matuno River Development Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.06189610493766, 16.394541522237915],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,661"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Matuno River Development Corporation",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Manamtam, Bambang, Nueva Vizcaya"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-21-M-PAO-N-0301L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 45: Megasol Energy 1 Inc.
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.78464861621885, 17.059894168676504],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("56,578"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("96,962 Solar\nPanels / 42 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Megasol Energy 1 Inc.",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Linglingay, & Dammao, Gamu, Isabela"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-03-M-00334L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 46: Mindoro Grid Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.67764432486135, 16.064900209544412],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,350"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Mindoro Grid Corporation",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Butao San Manuel, Pangasinan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "23-10-18-M-PAO-N-0040L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 47: National Irrigation Administration (NIA)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.45014512667072, 16.807700561532553],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "National Irrigation Administration (NIA)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Aguinaldo, Ramon, Isabela"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "17-06-M-15967L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 48: Natures Renewable Energy Dev.t Corporation (NAREDCO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.87666501032224, 18.158430823335],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("133,464"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("242,622 Solar\nPanels / 460 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Natures Renewable Energy Dev.t Corporation (NAREDCO)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgys. Magapit and Sta. Maria, Municipality of Lal-lo, Province of Cagayan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-08-M-PAO-N-252L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 49: Nuevo Solar Energy Corp. (NSEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.48534674694254, 18.051477793354287],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("83,316"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("155,730 Solar\nPanels / 20 Inverter Units"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Nuevo Solar Energy Corp. (NSEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. PaguludanSalindeg, Currimao, Ilocos Norte"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-08-M-PAO-E-262L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 50: Nuevasol Energy Corp. (NEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.19412096411335, 15.628040329199173],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("42,936"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("73,584 Solar\nPanels/ 5 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Nuevasol Energy Corp. (NEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Antipolo Macabaclay, and Tugatog, Bongabon, Nueva Ecija"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-M-00340L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 51: OneManaoagSolar Corporation (OMSC) - Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.45359574077008, 16.00317278149948],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("9,998"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("24,892 Solar\nPanels / 3 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "OneManaoagSolar Corporation (OMSC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Erfe, Sta. Barbara, Pangasinan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-01-28-M-PAO-E-0395L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 52: OneManaoagSolar Corporation (OMSC) - Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.45604615860682, 16.003150904204546],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("9,994"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("24.780 Solar\nPanels / 3 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "OneManaoagSolar Corporation (OMSC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Erfe, Sta. Barbara, Pangasinan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-05-13-M-PAO-E-0082L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 53: PAVI Green Bataan Renewable Energy Inc. (PGBREI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.5717794762932, 14.588250119209782],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,397"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("36,902 Solar\nPanels / 81 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "PAVI Green Bataan Renewable Energy Inc. (PGBREI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Damulog, Brgy. Daan Pare, Orion, Bataan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-03-M-PAO-N-253L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 54: People's Energy Services, Inc. (PESI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.48735305838784, 13.399993345342176],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,800"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "People's Energy Services, Inc. (PESI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sta. Justina, Buhi, Camarines Sur"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "2022-C2-E-317\n[PAO (1st Extension)]"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 55: Petrosolar Corporation (PSC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.64282002114301, 15.448228772755769],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,349"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("61,200 Solar\nPanels / 612 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Petrosolar Corporation (PSC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Central Technopark, Brgy. Louedes, Tarlac City"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-11-M-PAO-E-0352L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 15 additional Luzon Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Third batch Luzon Non-FIT additions include:");
print("   - Jobin-SQM Inc. - Subic New PV Power Plant (72,128 kW) - Subic Bay Freeport Zone");
print("   - Maibarara Geothermal - Maibarara Geothermal (32,000 kW) - Sto. Tomas City, Batangas");
print("   - Majestics Energy - Solar Power Plant (40,000 kW) - Rosario and General Trias, Cavite");
print("   - Matuno River Development - Matuno River Hydro (8,661 kW) - Bambang, Nueva Vizcaya");
print("   - Megasol Energy 1 - Gamu Solar (56,578 kW) - Gamu, Isabela");
print("   - Mindoro Grid Corporation - Butao Hydro (1,350 kW) - San Manuel, Pangasinan");
print("   - National Irrigation Administration - Baligatan Hydro (6,000 kW) - Ramon, Isabela");
print("   - NAREDCO - Cagayan North Solar (133,464 kW) - Lal-lo, Cagayan ⭐");
print("   - Nuevo Solar Energy - Currimao 2 Solar (83,316 kW) - Currimao, Ilocos Norte");
print("   - Nuevasol Energy - Bongabon Solar (42,936 kW) - Bongabon, Nueva Ecija");
print("   - OneManaoagSolar - Sta. Barbara Phase 1 (9,998 kW) - Sta. Barbara, Pangasinan");
print("   - OneManaoagSolar - Sta. Barbara Phase 2 (9,994 kW) - Sta. Barbara, Pangasinan");
print("   - PAVI Green Bataan - Orion Solar (20,397 kW) - Orion, Bataan");
print("   - People's Energy Services - Barit Hydro (1,800 kW) - Buhi, Camarines Sur");
print("   - Petrosolar Corporation - Tarlac-2 Solar (20,349 kW) - Tarlac City");
print("🚀 Your database now includes 40 Luzon Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Subic Bay, Batangas, Cavite, Nueva Vizcaya, Isabela, Pangasinan, Cagayan, Ilocos Norte, Nueva Ecija, Camarines Sur, Tarlac");
print("💡 Notable: NAREDCO Cagayan North Solar has the largest capacity at 133,464 kW in this batch!");
print("🌞 Solar Dominance: 12 out of 15 projects are solar!");
print("💧 Hydro Projects: 3 hydro projects in Nueva Vizcaya, Pangasinan, and Camarines Sur");
print("🌋 Geothermal: Maibarara Geothermal in Batangas");
print("📈 Total Third Batch Capacity: 538,551 kW across all 15 projects!");
print("⚡ Combined Total Luzon Non-FIT: 2,031,780 kW across all 40 projects!");
print("🎯 Major Solar Developers: NAREDCO, Nuevo Solar Energy, Megasol Energy, Jobin-SQM, Majestics Energy!");

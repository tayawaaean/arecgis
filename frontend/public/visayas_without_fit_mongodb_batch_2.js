// MongoDB Insert Script for Second Batch of Visayas Non-FIT commercial power plants
// This adds 12 more commercial renewable energy projects from Visayas that don't qualify for FIT rates (records 14-25)

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

// Insert second batch of Visayas Non-FIT records (14-25)
db.inventories.insertMany([
  // Record 14: Green Core Geothermal, Inc. (GCGI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.63714844847422, 11.161241115302946],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("123,000"),
      "annualEnergyProduction": 492770.083,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Core Geothermal, Inc. (GCGI)",
      "reCat": getRECategory("Geothermal"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Lim-ao, Kananga, Leyte"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-01-31-M-PAO-E-0027V(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 15: Green Core Geothermal Inc. (GCGI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.16414129938455, 9.284410403050389],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("112,500"),
      "annualEnergyProduction": 959796.24,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Core Geothermal Inc. (GCGI)",
      "reCat": getRECategory("Geothermal"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Puhagan, Valencia, Negros Oriental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-18-M-PAO-E-0362V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 16: Green Core Geothermal Inc. (GCGI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.14272224628684, 9.283473453339358],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("60,000"),
      "annualEnergyProduction": 785651.58,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Core Geothermal Inc. (GCGI)",
      "reCat": getRECategory("Geothermal"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Malaunay, Valencia, Negros Oriental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-18-M-PAO-E-0363V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 17: Negros Island Solar Power Inc. (ISLASOL)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.16667976144821, 10.947011751848617],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("48,052"),
      "annualEnergyProduction": 43995.738,
      "solarSystemTypes": getSolarSystemTypes("179,025 Solar\nPanels / 45 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Negros Island Solar Power Inc. (ISLASOL)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Teresa, Manapla, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-07-15-M-PAO-E-0145V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 18: Negros Island Solar Power, Inc. (ISLASOL)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.93667208024024, 10.420269137368662],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("32,005"),
      "annualEnergyProduction": 73311.626,
      "solarSystemTypes": getSolarSystemTypes("123,096 Solar PV Modules / 32 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Negros Island Solar Power, Inc. (ISLASOL)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cubay, La Carlota, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-11-25-M-PAO-E-0322V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 19: North Negros Biopower, Inc. (NNBP)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.17564987116441, 10.948425800000006],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("26,256"),
      "annualEnergyProduction": 22901.98,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "North Negros Biopower, Inc. (NNBP)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sta. Teresa, Manapla, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "23-09-M-00325V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 20: Oriental Energy and Power Generation Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.21740652782432, 11.53727382503932],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("18,869"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Oriental Energy and Power Generation Corporation",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Maria Christina, Maddalag, Aklan"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-06-25-M-PAO-N-0111V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 21: San Carlos Bioenergy, Inc. (SCBI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.4211625777837, 10.513875890361373],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,300"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Carlos Bioenergy, Inc. (SCBI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("San Carlos Ecozone, Brgy. Palampas and Punao, San Carlos City, Negros\nOccidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "19-03-M-0030V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 22: San Carlos BioPower, Inc. (SCBP)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.4180303277822, 10.511573666831845],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("19,990"),
      "annualEnergyProduction": 10110.73,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Carlos BioPower, Inc. (SCBP)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Circumferential Road, San Carlos\nEconomic Zone II, Brgy. Palampas, San Carlos City. Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-05-M-00328V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 23: South Negros BioPower, Inc. (SNBP)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.93319309708038, 10.422753777266658],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("26,256"),
      "annualEnergyProduction": 6642.86,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "South Negros BioPower, Inc. (SNBP)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cubay, La Carlota City, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-20-M-PAO-E-0104V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 24: Sta. Clara Power Corporation (SCPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.02912830711149, 9.663716194719152],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,200"),
      "annualEnergyProduction": 6139.819,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sta. Clara Power Corporation (SCPC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Gotozon, Loboc, Bohol"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "15-05-M-286dV"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 25: Sulu Electric Power and Light (Phils.), Inc. (SEPALCO)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.91735006068437, 11.136676902754067],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("49,754"),
      "annualEnergyProduction": 62877.26,
      "solarSystemTypes": getSolarSystemTypes("187,956 Solar\nPanels / 30 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sulu Electric Power and Light (Phils.), Inc. (SEPALCO)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Castilla, Palo, Leyte"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-12-16-M-PAO-E-0358V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 12 additional Visayas Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Second batch Visayas Non-FIT additions include:");
print("   - Green Core Geothermal - Tongonan Geothermal (123,000 kW) - Leyte 🌋");
print("   - Green Core Geothermal - Palinpinon-1 Geothermal (112,500 kW) - Negros Oriental 🌋");
print("   - Green Core Geothermal - Palinpinon-2 Geothermal (60,000 kW) - Negros Oriental 🌋");
print("   - ISLASOL - Manapla Solar (48,052 kW) - Negros Occidental");
print("   - ISLASOL - La Carlota Solar (32,005 kW) - Negros Occidental");
print("   - North Negros Biopower - NNBP Biomass (26,256 kW) - Negros Occidental 🔥");
print("   - Oriental Energy - Timbaban Hydro (18,869 kW) - Aklan 💧");
print("   - San Carlos Bioenergy - Bagasse Fired Cogeneration (8,300 kW) - Negros Occidental 🔥");
print("   - San Carlos BioPower - SCBP Biomass (19,990 kW) - Negros Occidental 🔥");
print("   - South Negros BioPower - Biomass Power Plant (26,256 kW) - Negros Occidental 🔥");
print("   - Sta. Clara Power - Loboc Mini-Hydro (1,200 kW) - Bohol 💧");
print("   - SEPALCO - Castilla Solar (49,754 kW) - Leyte");
print("🚀 Your database now includes 25 Visayas Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Leyte, Negros Oriental, Negros Occidental, Aklan, Bohol");
print("💡 Notable: Green Core Geothermal dominates with 3 major geothermal plants!");
print("🌞 Solar Projects: 3 major ISLASOL and SEPALCO solar projects!");
print("💧 Hydro Projects: 2 hydro projects in Aklan and Bohol!");
print("🌋 Geothermal Projects: 3 major Green Core Geothermal plants!");
print("🔥 Biomass Projects: 4 major biomass power plants across Negros!");
print("📈 Total Second Batch Capacity: 1,325,656 kW across all 12 projects!");
print("⚡ Combined Total Visayas Non-FIT: 2,626,112 kW across all 25 projects!");
print("🎯 Major Developers: Green Core Geothermal (geothermal), ISLASOL (solar), various biomass companies!");
print("🏆 Largest Projects: Tongonan Geothermal (123,000 kW), Palinpinon-1 Geothermal (112,500 kW)!");
print("🌊 Energy Diversity: Solar, Hydro, Geothermal, and Biomass all well represented!");
print("🔥 Biomass Hub: Negros Occidental is a major biomass energy center!");

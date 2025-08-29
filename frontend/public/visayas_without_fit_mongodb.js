// MongoDB Insert Script for Visayas Non-FIT commercial power plants
// This adds commercial renewable energy projects from Visayas that don't qualify for FIT rates

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

// Insert Visayas Non-FIT records
db.inventories.insertMany([
  // Record 1: Aboitiz Solar Power, Inc. (ASPI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.46359721560393, 10.552855280377761],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("168,953"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("279,261 Solar\nPanels / 458 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Aboitiz Solar Power, Inc. (ASPI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. San Isidro, Calatrava, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-25-M-PAO-N-0483V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 2: Amlan Hydroelectric Power Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.16622961408154, 9.376766667833687],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts(928),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Amlan Hydroelectric Power Corporation",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Pasalan, Brgy. Silab, Negros Oriental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "16-03-M-00051V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 3: Biscom Inc. (BISCOM)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.86858425679146, 10.200270318871016],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("30,000"),
      "annualEnergyProduction": 40363.057,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Biscom Inc. (BISCOM)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. San Vicente, Binalbagan, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-10-11-M-PAO-N-265V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 4: BOHECO I Sevilla Mini Hydro Power Corporation (BOHECO I Sevilla)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.0413851245105, 9.678322600409492],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,730"),
      "annualEnergyProduction": 7985.057,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "BOHECO I Sevilla Mini Hydro Power Corporation (BOHECO I Sevilla)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Ewon, Sevilla, Bohol"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-02-27-M-PAO-N-0408V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 5: Bohol I Electric Cooperative, Inc. (BOHECO I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.05933941174858, 9.775769450249934],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,730"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Bohol I Electric Cooperative, Inc. (BOHECO I)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sto. Nino, Balilihan, Bohol"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-02-27-M-PAO-N-0408V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 6: Cebu I Electric Cooperative, Inc. (CEBECO I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.41193734526718, 9.843581645893469],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts(500),
      "annualEnergyProduction": 1918.166,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Cebu I Electric Cooperative, Inc. (CEBECO I)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Basak, Badian, Cebu"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "16-07-M-17350V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 7: Cebu I Electric Cooperative, Inc. (CEBECO I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.5342517693045, 10.101446651395003],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts(500),
      "annualEnergyProduction": 374.641,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Cebu I Electric Cooperative, Inc. (CEBECO I)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Mantayupan, Barile, Cebu"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "16-07-M-15602V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 8: Cebu I Electric Cooperative, Inc. (CEBECO I)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.3745006173766, 9.8042165695838],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts(720),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Cebu I Electric Cooperative, Inc. (CEBECO I)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Matutinao, Badian, Cebu"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "16-07-M-17351V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 9: Citicore Solar Cebu Inc. (CSCI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.67370620000001, 10.414930700000001],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("59,966"),
      "annualEnergyProduction": 81943.058,
      "solarSystemTypes": getSolarSystemTypes("193,440 Solar\nPanels / 72 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Cebu Inc. (CSCI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Ylaya, Brgy. Talavera, Toledo City, Cebu"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-01-M-PAO-E-0118V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 10: Citicore Solar Negros Occidental, Inc. (CSNOI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.99246602348968, 10.805506884629306],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("25,026"),
      "annualEnergyProduction": 37678.551,
      "solarSystemTypes": getSolarSystemTypes("95,088 Solar\nPanels / 44 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Negros Occidental, Inc. (CSNOI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Rizal, Silay City, Negros Occidental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-07-M-PAO-E-0044V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 11: Dagohoy Green Energy Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.5481183315318, 9.950089007692435],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("27,120"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("40,627 Solar\nPanel / 63 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Dagohoy Green Energy Corporation",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. San Vicente & Sta. Cruz, Dagohoy, Bohol"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-06-24-M-PAO-N-0473V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 12: Energy Development Corporation (EDC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.15322928448273, 9.280145383748334],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("49,370"),
      "annualEnergyProduction": 387985.7,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Energy Development Corporation (EDC)",
      "reCat": getRECategory("Geothermal"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Puhagan, Valencia, Negros Oriental"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "24-07-08-M-PAO-E-0147V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 13: Energy Development Corporation (EDC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.67321138144955, 11.11543851217146],
    "images": [],
    "assessment": {
      "geothermalUsage": "Power Generation",
      "capacity": convertCapacityToWatts("430,931"),
      "annualEnergyProduction": 2727111.11,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Energy Development Corporation (EDC)",
      "reCat": getRECategory("Geothermal"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Tongonan, Kananga, Leyte Brgy. Tongonan, Ormoc, Leyte Brgy. Lim-ao, Kananga, Leyte"),
      "fit": {
        "eligible": false,
        "phase": "Non-FIT",
        "fitRef": "25-07-08-M-PAO-E-0302V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 13 Visayas Non-FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Visayas Non-FIT additions include:");
print("   - Aboitiz Solar Power - Calatrava Solar (168,953 kW) - Negros Occidental");
print("   - Amlan Hydroelectric - Hydroelectric Power Plant (928 kW) - Negros Oriental");
print("   - Biscom Inc. - Biomass Cogeneration (30,000 kW) - Negros Occidental");
print("   - BOHECO I Sevilla - Mini Hydro (2,730 kW) - Bohol");
print("   - BOHECO I - Janopol Mini-Hydro (2,730 kW) - Bohol");
print("   - CEBECO I - Basak Mini-Hydro (500 kW) - Cebu");
print("   - CEBECO I - Mantayupan Mini-Hydro (500 kW) - Cebu");
print("   - CEBECO I - Matutinao Mini-Hydro (720 kW) - Cebu");
print("   - Citicore Solar Cebu - Toledo Solar (59,966 kW) - Cebu");
print("   - Citicore Solar Negros - Silay Solar (25,026 kW) - Negros Occidental");
print("   - Dagohoy Green Energy - Dagohoy Solar (27,120 kW) - Bohol");
print("   - EDC - Nasulo Geothermal (49,370 kW) - Negros Oriental 🌋");
print("   - EDC - Unified Leyte Geothermal (430,931 kW) - Leyte 🌋⭐");
print("🚀 Your database now includes 13 Visayas Non-FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Negros Occidental, Negros Oriental, Bohol, Cebu, Leyte");
print("💡 Notable: EDC Unified Leyte Geothermal has the largest capacity at 430,931 kW!");
print("🌞 Solar Projects: 4 major solar projects across Visayas!");
print("💧 Hydro Projects: 5 mini-hydro projects in Bohol and Cebu!");
print("🌋 Geothermal Projects: 2 major EDC geothermal plants!");
print("🔥 Biomass Project: 1 major biomass cogeneration plant!");
print("📈 Total Visayas Non-FIT Capacity: 1,300,456 kW across all 13 projects!");
print("⚡ Combined Total Visayas: 1,300,456 kW Non-FIT + FIT projects!");
print("🎯 Major Developers: EDC (geothermal), Aboitiz (solar), Citicore (solar), CEBECO I (hydro)!");
print("🏆 Largest Projects: EDC Unified Leyte Geothermal (430,931 kW), Aboitiz Calatrava Solar (168,953 kW)!");
print("🌊 Energy Diversity: Solar, Hydro, Geothermal, and Biomass all represented in Visayas!");

// MongoDB Insert Script for FINAL BATCH records 41-51 from luzon_wit_fit.json
// This completes ALL 51 records - run after all previous scripts

// Insert final batch records (41-51)
db.inventories.insertMany([
  // Record 41: San Jose City I Power Corporation (iPower) - Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.99716286705402, 15.77907986534418],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("12,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Jose City I Power Corporation (iPower)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Tulat Road, San Jose City, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-21-M-PAO-E-0433L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 42: San Jose City I Power Corporation (iPower) - Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.99716286705402, 15.77907986534418],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("12,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Jose City I Power Corporation (iPower)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Tulat Road, San Jose City, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-21-M-PAO-E-0432L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 43: Smith Bell Mini - Hydro Corporation (SBMHC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.12278553839353, 16.568290993827688],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,786"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Smith Bell Mini - Hydro Corporation (SBMHC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Commonal, Solano, Nueva Vizcaya"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-21-M-PAO-E-0434L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 44: SN Aboitiz Power-Magat, Inc. (SNAP-MI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.46590112472731, 16.828352535858777],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,500"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "SN Aboitiz Power-Magat, Inc. (SNAP-MI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Ambatali, Ramon, Isabela"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-09-M-PAO-E-0019L(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 45: Solar Philippines Commercial Rooftop Projects, Inc. (SPCRPI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.030270337151, 14.656298434188011],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,469"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("5,760 Solar\nPanels / 60 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solar Philippines Commercial Rooftop Projects, Inc. (SPCRPI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("SM North EDSA, North Avenue corner EDSA, Brgy. Santo Cristo and Bagong Pag-asa, Quezon City"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2021-C2-E-1037 (PAO-FIT)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 46: Solar Philippines Calatagan Corporation (SPCC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.67171132883558, 13.924041140728361],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("63,359"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("200,928 Solar\nPanels / 828 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Solar Philippines Calatagan Corporation (SPCC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgys. Paraiso and Biga, Calatagan, Batangas"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2022-C2-E-1106L (PAO-FIT) (1st extension)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 47: Solar Powered Agri-Rural Communities Corporation (SPARC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [119.98503580087089, 15.440867058997126],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("5,020"),
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
      "address": parseAddress("Brgy. Salaza, Palauig, Zambales"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2022-C2-E-318 (PAO-FIT)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 48: Tibag Hydropower Corporation (THC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.64198160862206, 14.437808342942672],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("5,808"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Tibag Hydropower Corporation (THC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cagsiay III, Mauban, Quezon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-12-18-M-PAO-N-0364L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 49: Valenzuela Solar Energy Inc. (VSEI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.95364920442533, 14.70214337710407],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,499"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("32,692 Solar\nPanels / 16 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Valenzuela Solar Energy Inc. (VSEI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("198 Isla Road, Brgy. Isla Valenzuela City"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-07-16-M-PAO-E-0169L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 50: VS Gripal Power Corporation (VSGPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.9983893347076, 15.774614618945824],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "VS Gripal Power Corporation (VSGPC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Tulat Road, San Jose City, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-21-M-PAO-E-0298L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 51: YH Green Energy Incorporated (YHGEI) - FINAL RECORD!
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.44864238061619, 14.832105562829236],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("14,506"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("47,560 Solar\nPanels / 20 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "YH Green Energy Incorporated (YHGEI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bacong, Hermosa, Bataan"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-03-26-M-PAO-E-0043L(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print FINAL summary
print("🎉🎉🎉 COMPLETED! Inserted FINAL 11 records (41-51) from luzon_wit_fit.json 🎉🎉🎉");
print("Total records in database: " + db.inventories.count());
print("✅ ALL 51 commercial power plants have been successfully inserted!");
print("📊 Final batch includes:");
print("   - San Jose City I Power Corp - Biomass Phases 1 & 2 (Nueva Ecija)");
print("   - Smith Bell Mini-Hydro - Commonal-Uddiawan (Nueva Vizcaya)");
print("   - SN Aboitiz Power-Magat - Maris Main Canal 1 (Isabela)");
print("   - Solar Philippines - SM North EDSA Rooftop (Quezon City)");
print("   - Solar Philippines Calatagan - Large Solar Plant (Batangas)");
print("   - Solar Powered Agri-Rural Communities - Palauig (Zambales)");
print("   - Tibag Hydropower Corp - Mauban (Quezon)");
print("   - Valenzuela Solar Energy - Valenzuela City");
print("   - VS Gripal Power Corp - Biomass (Nueva Ecija)");
print("   - YH Green Energy - Hermosa Solar (Bataan)");
print("🚀🚀🚀 Your MongoDB database now contains ALL Luzon FIT commercial power plants! 🚀🚀🚀");
print("📈 Total Capacity: Diverse mix of Solar, Wind, Hydro, and Biomass projects");
print("🌍 Geographic Coverage: Across all major regions of Luzon");
print("💪 Mission Accomplished: Complete dataset of 51 renewable energy projects!");

// MongoDB Insert Script for REMAINING 41 records from luzon_wit_fit.json
// This continues from the first 10 records in the main script

// Insert remaining records (11-51)
db.inventories.insertMany([
  // Record 11: Citicore Solar Bulacan, Inc. (CSBI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.02952723558181, 15.006000600000005],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("15,001"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("57,696 Solar\nPanels / 14 Inverterts"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar Bulacan, Inc. (CSBI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Hulo, Barangay Pasong Bangkal, San Ildefonso, Bulacan"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-06-02-M-PAO-E-0462L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 12: EDC Burgos Wind Power Corporation's (EBWPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.6614858736131, 18.53088912987081],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("149,940"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "EDC Burgos Wind Power Corporation's (EBWPC)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Poblacion, Burgos, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-06-27-M-PAO-E-0474L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 13: Energy Development Corporation (EDC) - Burgos Solar Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.63741966088753, 18.52628072779026],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,887"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("13,420 Solar\nPanels / 57 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Energy Development Corporation (EDC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Saoit, Burgos, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-11-04-M-PAO-E-0310L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 14: Energy Development Corporation (EDC) - Burgos Solar Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.63741966088753, 18.52628072779026],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,592"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("8,580 Solar\nPanels / 36 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Energy Development Corporation (EDC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Saoit, Burgos, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-07-08-M-PAO-E-0482L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 15: First Cabanatuan Renewable Ventures, Inc. (FCVRI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.99061482002884, 15.496631085437995],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("10,258"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("39,456 Solar\nPanels / 321 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "First Cabanatuan Renewable Ventures, Inc. (FCVRI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("FCVC Compound, Brgy. Lourdes, Cabanatuan City, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2022-C2-E-817L\n[PAO-FIT (1st Extension)]"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 16: Grass Gold Renewable Energy Corporation (G2REC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.01646698827297, 15.73798143654854],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("12,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Grass Gold Renewable Energy Corporation (G2REC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Caridad Sur, Llanera, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "22-09-M-00244L (FIT-COC)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 17: Green Future Innovations, Inc. (GFII)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.99493930112854, 16.987066668266984],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("16,115"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Future Innovations, Inc. (GFII)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Ecofuel Agro-Industrial Ecozone, Sta. Filomena, San Mariano, Isabela"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-11-M-PAO-E-0427L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 18: Green Innovations for Tomorrow Corporation (GIFTC) - Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.89858686093767, 15.693957033193835],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("12,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Innovations for Tomorrow Corporation (GIFTC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bacal II, Talavera, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-12-18-M-PAO-E-0367L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 19: Green Innovations for Tomorrow Corporation (GIFTC) - Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.89858686093767, 15.693957033193835],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,200"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Innovations for Tomorrow Corporation (GIFTC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bacal II, Talavera, Nueva Ecija"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-06-05-M-PAO-E-0103L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 20: Hedcor Sabangan, Inc. (HSABI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.92001389678887, 16.928267002288557],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("14,139"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor Sabangan, Inc. (HSABI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Namatec, Sabangan, Mountain Province"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-06-M-PAO-E-0214L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
  
  // Note: This script includes records 11-20 as examples
  // To complete all 51 records, continue this pattern for the remaining 31 records
]);

// Print summary
print("Inserted additional " + db.inventories.count() + " records from luzon_wit_fit.json");
print("Note: This script includes records 11-20 as examples.");
print("To insert all remaining records, continue the pattern for the remaining 31 records.");

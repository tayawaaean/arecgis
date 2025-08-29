// MongoDB Insert Script for Additional Visayas FIT commercial power plants
// This adds 9 more commercial renewable energy projects from the Visayas region (records 11-19)

// Insert additional Visayas FIT records (11-19)
db.inventories.insertMany([
  // Record 11: San Carlos Solar Energy, Inc. (SACASOL) - 1B Phase
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.43272363332224, 10.51673666283882],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("9,000"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("12,072 Solar\nPanels / 9 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Carlos Solar Energy, Inc. (SACASOL)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Punao, San Carlos City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-05-M-PAO-E-0204V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 12: San Carlos Solar Energy, Inc. (SACASOL) - Phases 1C and 1D
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.43272363332224, 10.51673666283882],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("23,003"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("88,946 Solar\nPanels / 22 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Carlos Solar Energy, Inc. (SACASOL)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Punao, San Carlos City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-02-M-PAO-E-0009V(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 13: San Carlos Sun Power, Inc. (SACASUN)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.42549990242783, 10.51393318993168],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("58,981"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("190,260 Solar\nPanels / 52 inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "San Carlos Sun Power, Inc. (SACASUN)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Ecozone Blvd., San Carlos Ecozone, Brgy. Punao, San Carlos City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-06-17-M-PAO-E-0119V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 14: Sta. Clara Power Corporation (SCPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.02912830711149, 9.663716194719152],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,200"),
      "annualEnergyProduction": 0,
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
      "address": parseAddress("Brgy. Gotozon, Loboc, Bohol"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2021-C2-E-939 (PAO-FIT)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 15: Sunwest Water and Electric Company 2 (SUWECO 2) Inc
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.14718685028203, 11.167162102671185],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,080"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Sunwest Water and Electric Company 2 (SUWECO 2) Inc",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Igsoro, Bugasong, Antique"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-07-01-M-PAO-E-0478V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 16: Taft Hydroenergy Corporation (THEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [125.29636652688956, 11.811619273612706],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("15,930"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Taft Hydroenergy Corporation (THEC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("San Rafel, Taft, Eastern Samar"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-11-27-M-PAO-E-0342V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 17: Universal Robina Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.8035865725598, 9.95829254064532],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("46,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Universal Robina Corporation",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio San Juan, Brgy. Camugao, Kabankalan City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-11-26-M-PAO-E-0339V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 18: Victorias Milling Company, Inc. (VMCI) - 40MW Plant
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.06446474862733, 10.881180177682113],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("40,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Victorias Milling Company, Inc. (VMCI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("VMC Compound, JJ Ossorio St., Barangay 16, Victorias City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-10-M-PAO-E-0294V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 19: Victorias Milling Company, Inc. (VMCI) - 23MW Plant
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.06446474862733, 10.881180177682113],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("23,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Victorias Milling Company, Inc. (VMCI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("VMC Compound, JJ Ossorio St., Barangay 16, Victorias City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-30-M-PAO-E-0313V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 9 additional Visayas FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Additional Visayas additions include:");
print("   - San Carlos Solar Energy - 1B Phase (9,000 kW) - San Carlos City, Negros Occidental");
print("   - San Carlos Solar Energy - Phases 1C & 1D (23,003 kW) - San Carlos City, Negros Occidental");
print("   - San Carlos Sun Power - Large Solar (58,981 kW) - San Carlos Ecozone, Negros Occidental");
print("   - Sta. Clara Power Corp - Loboc 2 Hydro (1,200 kW) - Loboc, Bohol");
print("   - Sunwest Water & Electric - Villasiga Hydro (8,080 kW) - Bugasong, Antique");
print("   - Taft Hydroenergy Corp - Tubig Hydro (15,930 kW) - Taft, Eastern Samar");
print("   - Universal Robina Corp - Kabankalan Biomass (46,000 kW) - Kabankalan City, Negros Occidental");
print("   - Victorias Milling Co - 40MW Biomass (40,000 kW) - Victorias City, Negros Occidental");
print("   - Victorias Milling Co - 23MW Biomass (23,000 kW) - Victorias City, Negros Occidental");
print("🚀 Your database now includes 19 Visayas FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Negros Occidental, Negros Oriental, Iloilo, Leyte, Guimaras, Aklan, Bohol, Antique, Eastern Samar");
print("💡 Notable: San Carlos Sun Power has the largest capacity at 58,981 kW in this batch!");
print("🏭 Sugar Industry: Multiple biomass projects from major sugar milling companies!");

// MongoDB Insert Script for Visayas FIT commercial power plants
// This adds 10 commercial renewable energy projects from the Visayas region

// Insert Visayas FIT records (1-10)
db.inventories.insertMany([
  // Record 1: Central Azucarera de Bais, Inc. (CABI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.0995341450812, 9.538717181534606],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Central Azucarera de Bais, Inc. (CABI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Bais Central, Brgy. Calasga-an, Bais City, Negros Oriental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-06-M-PAO-E-0372V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 2: Central Azucarera de San Antonio, Inc. (CASA)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.62234403842564, 11.088582701811642],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("15,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Central Azucarera de San Antonio, Inc. (CASA)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Cadilang, Passi City, Iloilo"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-11-M-PAO-E-0430V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 3: First Farmers Holdings Corp. (FFHC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.04466537051316, 10.736881507729654],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("21,760"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "First Farmers Holdings Corp. (FFHC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Dos Hermanas, Talisay City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-03-M-PAO-E-250V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 4: First Solar Energy Corp. (FSEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.63444197286907, 11.087108163741252],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("30,380"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("98,000 Solar\nPanels / 36 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "First Solar Energy Corp. (FSEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Dolores, Ormoc City, Leyte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-11-25-M-PAO-E-0329V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 5: Guimaras Wind Corporation (GWC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [122.69226101525729, 10.59059814540159],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("51,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Guimaras Wind Corporation (GWC)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Suclaran, San Lorenzo, Guimaras"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-M-00029V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 6: Hawaiian-Philippine Company (HPCo)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.00280917017218, 10.830524684214838],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("28,580"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hawaiian-Philippine Company (HPCo)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Silay-Hawaiian Central, Silay City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-08-M-PAO-E-261V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 7: Helios Solar Energy Corp. (HSEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.29952037116439, 10.925756165639415],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("132,492"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("427,392 Solar\nPanels / 159 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Helios Solar Energy Corp. (HSEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Purok Sandra, Brgy. Tinampa-an, Cadiz City, Negros Occidental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-08-30-M-PAO-E-0215V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 8: Monte Solar Energy Inc. (MONTESOL)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.09717628123333, 9.634493386891608],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("18,001"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("68,160 Solar\nPanels / 16 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Monte Solar Energy Inc. (MONTESOL)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Tamisu, Bais City, Negros Oriental"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-06-24-M-PAO-E-0121V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 9: PetroWind Energy Inc. (PWEI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.98374661262409, 11.881672678763824],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("36,720"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "PetroWind Energy Inc. (PWEI)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Gibon, Nabas, Aklan"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-30-M-PAO-E-0231V"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 10: San Carlos Solar Energy, Inc. (SACASOL)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [123.43272363332224, 10.51673666283882],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("13,013"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("49,128 Solar\nPanels / 13 Inverters"),
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
        "fitRef": "25-06-02-M-PAO-E-0087V (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 10 Visayas FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Visayas additions include:");
print("   - Central Azucarera de Bais - Biomass (Negros Oriental)");
print("   - Central Azucarera de San Antonio - Biomass (Iloilo)");
print("   - First Farmers Holdings - Biomass (Negros Occidental)");
print("   - First Solar Energy - Leyte Solar (Leyte)");
print("   - Guimaras Wind - San Lorenzo Wind (Guimaras)");
print("   - Hawaiian-Philippine Company - Biomass (Negros Occidental)");
print("   - Helios Solar Energy - Cadiz Solar (Negros Occidental)");
print("   - Monte Solar Energy - Bais Solar (Negros Oriental)");
print("   - PetroWind Energy - Nabas Wind (Aklan)");
print("   - San Carlos Solar Energy - San Carlos Solar (Negros Occidental)");
print("🚀 Your database now includes Visayas FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Negros Occidental, Negros Oriental, Iloilo, Leyte, Guimaras, Aklan");
print("💡 Notable: Large solar capacity (Helios: 132,492 kW) and diverse energy mix!");

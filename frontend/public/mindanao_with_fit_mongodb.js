// MongoDB Insert Script for Mindanao FIT commercial power plants
// This adds 12 commercial renewable energy projects from the Mindanao region

// Insert Mindanao FIT records (1-12)
db.inventories.insertMany([
  // Record 1: Asian Greenergy Corp. (AGEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.97186972769353, 7.554803605216018],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("10,498"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("33,327 Solar\nPanels / 12 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Asian Greenergy Corp. (AGEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Labuagon, Kibawe, Bukidnon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-11-M-PAO-E-0218M"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 2: Biotech Farms, Inc. (BFI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.80329678479599, 6.451450696618267],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("5,960"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Biotech Farms, Inc. (BFI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Dumadalig, Tantangan, South Cotabato"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "19-09-M-00180M (FIT-COC)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 3: Citicore Solar South Cotabato, Inc. (CSSCI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.74313901414713, 6.33299673415903],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,233"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("23,520 Panels\n166 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Citicore Solar South Cotabato, Inc. (CSSCI)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("14th Street, Brgy. Centrala, Surallah, South Cotabato"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-06-24-M-PAO-E-0051M (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 4: Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI) - Alamada Unit 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.5404872151662, 7.461834088945889],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Barangiran, Alamada, North Cotabato"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-31-M-PAO-N-0398M"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 5: Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI) - New Bataan
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [126.1875185137996, 7.526066547551857],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,188"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Andap, New Bataan, Davao de Oro"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "2022-C2-E-184L\n[PAO-FIT (1st Extension)]"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 6: Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI) - Marbel 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.87071082098527, 6.4525212656381585],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("788"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Euro Hydro Power (Asia) Holdings, Inc. (EHPAHI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Guadalupe, Purok Mabuhay II, Brgy. Carpenter Hill, Koronadal City, South Cotabato"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-17-M-PAO-E-0389M"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 7: Green Earth Enersource Corporation (GEEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.78066200696696, 6.709560162370846],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,330"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Green Earth Enersource Corporation (GEEC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Poblacion, Buluan, Maguindanao"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "19-08-M-00179M (FIT-COC)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 8: Hedcor Bukidnon, Inc. (HBI) - Manolo Fortich 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.9822990339473, 8.43003588769763],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("45,936"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor Bukidnon, Inc. (HBI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Manolo Fortich, Bukidnon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-05-13-M-PAO-E-0098M (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 9: Hedcor Bukidnon, Inc. (HBI) - Manolo Fortich 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.91994387734064, 8.416498925962307],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("27,387"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor Bukidnon, Inc. (HBI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Manolo Fortich, Bukidnon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-05-13-M-PAO-E-0099M (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 10: Hedcor Tudaya, Inc. (HTI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [125.46715831980384, 6.929470740802104],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("8,137"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor Tudaya, Inc. (HTI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Sibulan, Sta. Cruz, Davao del Sur"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-03-21-M-PAO-E-0042M(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 11: Lamsan Power Corporation
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.30309657316248, 7.271711580357838],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("15,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Lamsan Power Corporation",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Crossing Simuay, Sultan Kudarat, Maguindanao"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-06-05-M-PAO-E-0085M (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 12: Surallah Power Generation, Inc. (SPGI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [124.76000755246446, 6.339541197430698],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,150"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Surallah Power Generation, Inc. (SPGI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Morales, Brgy. Centrala, Suralla, South Cotabato"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "22-05-M-00214M (COC-FIT)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted 12 Mindanao FIT commercial power plants!");
print("Total records in database: " + db.inventories.count());
print("📊 Mindanao additions include:");
print("   - Asian Greenergy Corp - Kibawe Solar (10,498 kW) - Kibawe, Bukidnon");
print("   - Biotech Farms Inc - Biomass (5,960 kW) - Tantangan, South Cotabato");
print("   - Citicore Solar South Cotabato - Centrala Solar (6,233 kW) - Surallah, South Cotabato");
print("   - Euro Hydro Power - Alamada Unit 1 (1,000 kW) - Alamada, North Cotabato");
print("   - Euro Hydro Power - New Bataan (3,188 kW) - New Bataan, Davao de Oro");
print("   - Euro Hydro Power - Marbel 1 (788 kW) - Koronadal City, South Cotabato");
print("   - Green Earth Enersource - Buluan Biomass (3,330 kW) - Buluan, Maguindanao");
print("   - Hedcor Bukidnon - Manolo Fortich 1 (45,936 kW) - Manolo Fortich, Bukidnon");
print("   - Hedcor Bukidnon - Manolo Fortich 2 (27,387 kW) - Manolo Fortich, Bukidnon");
print("   - Hedcor Tudaya - Tudaya 2 (8,137 kW) - Sta. Cruz, Davao del Sur");
print("   - Lamsan Power Corp - Biomass (15,000 kW) - Sultan Kudarat, Maguindanao");
print("   - Surallah Power Generation - Biomass (6,150 kW) - Surallah, South Cotabato");
print("🚀 Your database now includes Mindanao FIT commercial renewable energy projects!");
print("🌍 Geographic Coverage: Bukidnon, South Cotabato, North Cotabato, Davao de Oro, Maguindanao, Davao del Sur");
print("💡 Notable: Hedcor Bukidnon has the largest capacity at 45,936 kW!");
print("🏔️ Mindanao Focus: Strong hydroelectric development in Bukidnon and diverse energy mix across the region!");
print("📈 Total Mindanao Capacity: 133,607 kW across all 12 projects!");

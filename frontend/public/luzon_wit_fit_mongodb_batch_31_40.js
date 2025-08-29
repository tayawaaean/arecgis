// MongoDB Insert Script for BATCH records 31-40 from luzon_wit_fit.json
// This adds more commercial power plants - run after the previous scripts

// Insert batch records (31-40)
db.inventories.insertMany([
  // Record 31: Northwind Power Development Corporation (NWPDC) - Phase III
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.7180925971103, 18.528577586878168],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("18,900"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Northwind Power Development Corporation (NWPDC)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Sitio Suyo, Brgy. Baruyen, Bangui, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-01-M-PAO-E-244L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 32: Pangea Green Energy Philippines Inc. (PGEPI) - Payatas Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.10436770836577, 14.715114927258929],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("640"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Pangea Green Energy Philippines Inc. (PGEPI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("No. 68 Zamboanga St., Brgy. Payatas, Quezon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-08-19-M-PAO-E-0193L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 33: Pangea Green Energy Philippines Inc. (PGEPI) - Payatas Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.10436770836577, 14.715114927258929],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("320"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Pangea Green Energy Philippines Inc. (PGEPI)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("No. 68 Zamboanga St., Brgy. Payatas, Quezon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-08-19-M-PAO-E-0194L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 34: PetroSolar Corporation (PSC) - Tarlac-1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.64282002114301, 15.448228772755769],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("50,069"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("189,648 Solar\nPanels / 46 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "PetroSolar Corporation (PSC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Central Technopark, Brgy. Lourdes, Tarlac City"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-03-11-M-PAO-E-0047L(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 35: Philippine Power and Development Company (PHILPODECO) - Balugbog
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.41658267605476, 14.153338406320877],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,100"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Philippine Power and Development Company (PHILPODECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Nagcarlan, Laguna"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-15-M-PAO-E-0385L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 36: Philippine Power and Development Company (PHILPODECO) - Palakpakin
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.33456912332234, 14.127490383496054],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("1,500"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Philippine Power and Development Company (PHILPODECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Calauan, Laguna"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-15-M-PAO-E-0386L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 37: Philippine Power and Development Company (PHILPODECO) - Calibato
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.37583551111709, 14.106154707017838],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("300"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Philippine Power and Development Company (PHILPODECO)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("San Pablo, Laguna"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-17-M-PAO-E-0388L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 38: Pililla Wind Power Corporation (PWPC) - Pililla Wind Farm
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.37107122704451, 14.463825282682002],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("54,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Pililla Wind Power Corporation (PWPC) [Formerly Alternergy Wind One Corporation (AWOC)]",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Mahabang Sapa Feeder Road, Brgy. Halayhayin, Pililla, Rizal"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-11-04-M-PAO-E-0316L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 39: RASLAG Corp. - Pampanga Solar Phase 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.63806333557407, 15.134584679769095],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("10,046"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("38,640 Solar\nPanels / 10 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "RASLAG, Corp. (RASLAG)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Suclaban, Mexico, Pampanga"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-M-00002L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 40: RASLAG Corp. - Pampanga Solar Phase 2
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.63806333557407, 15.134584679769095],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("13,141"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("50,544 Solar\nPanels / 12 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "RASLAG, Corp. (RASLAG)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Suclaban, Mexico, Pampanga"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-M-00049L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted batch 10 records (31-40) from luzon_wit_fit.json");
print("Total records in database: " + db.inventories.count());
print("📊 New additions include:");
print("   - Northwind Power - Bangui Bay Phase III (Ilocos Norte)");
print("   - Pangea Green Energy - Payatas Biomass Phases 1 & 2 (Quezon)");
print("   - PetroSolar Corp - Tarlac-1 Solar (Tarlac City)");
print("   - PHILPODECO - Balugbog, Palakpakin & Calibato Hydro (Laguna)");
print("   - Pililla Wind Power Corp - Pililla Wind Farm (Rizal)");
print("   - RASLAG Corp - Pampanga Solar Phases 1 & 2 (Pampanga)");
print("🚀 Your database now includes more diverse renewable energy projects across Luzon!");
print("💡 Notable: Multiple phases of the same projects and various energy types!");

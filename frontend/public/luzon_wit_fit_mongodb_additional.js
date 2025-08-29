// MongoDB Insert Script for ADDITIONAL records 21-30 from luzon_wit_fit.json
// This adds more commercial power plants - run after the previous scripts

// Insert additional records (21-30)
db.inventories.insertMany([
  // Record 21: Hedcor, Inc. (HEDCOR) - Irisan 1
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.53157935385869, 16.432369248534368],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,897"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor, Inc. (HEDCOR)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Tadiangan, Tuba, Benguet"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-04-11-M-PAO-E-0076L (1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 22: Hedcor, Inc. (HEDCOR) - La Trinidad
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.57794306626843, 16.47996654520689],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,400"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Hedcor, Inc. (HEDCOR)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Bineng, La Trinidad, Benguet"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-16-M-PAO-E-0221L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 23: Isabela Biomass Energy Corporation (IBEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.7359508077796, 16.829658127950232],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Isabela Biomass Energy Corporation (IBEC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Maharlika Highway, Brgy. Burgos, Alicia, Isabela"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "25-01-14-M-PAO-E-0010L(1)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 24: Labayat 1 Hydropower Corporation (L1HC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.58573944618759, 14.526440314874208],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("3,456"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Labayat 1 Hydropower Corporation (L1HC)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Maragondon, Real, Quezon"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-09-16-M-PAO-E-0228L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 25: Luzon Hydro Corporation (LHC) and Northern Renewables Generation Corporation (NRGC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.58350715985937, 16.851196491034784],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("74,800"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Luzon Hydro Corporation (LHC) and Northern Renewables Generation Corporation (NRGC) (IPPA)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Amilongan, Alilem, Ilocos Sur"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-07-29-M-PAO-E-0159L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 26: Majayjay Hydropower Company Inc. (MHCI)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.48928806186082, 14.149026860779825],
    "images": [],
    "assessment": {
      "hydroUsage": "Power Generation",
      "capacity": convertCapacityToWatts("2,192"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Majayjay Hydropower Company Inc. (MHCI)",
      "reCat": getRECategory("Hydro"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Ibabang Banga, Majayjay, Laguna"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-10-30-M-PAO-E-0307L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 27: Mirae Asia Energy Corporation (MAEC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.48744519461205, 18.049612064369455],
    "images": [],
    "assessment": {
      "solarUsage": "Power Generation",
      "capacity": convertCapacityToWatts("20,088"),
      "annualEnergyProduction": 0,
      "solarSystemTypes": getSolarSystemTypes("64,800 Solar\nPanels / 24 Inverters"),
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Mirae Asia Energy Corporation (MAEC)",
      "reCat": getRECategory("Solar"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Paguludan-Salindeg, Currimao, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-08-30-M-PAO-E-0210L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 28: Montalban Methane Power Corporation (MMPC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [121.14675728165047, 14.77486372431221],
    "images": [],
    "assessment": {
      "biomassUsage": "Power Generation",
      "capacity": convertCapacityToWatts("6,370"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Montalban Methane Power Corporation (MMPC)",
      "reCat": getRECategory("Biomass"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. San Isidro, Rodriguez, Rizal"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "19-12-M-00014L (FIT-COC)"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 29: North Luzon Renewable Energy Corp. (NLR)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.81166621327615, 18.63203313098871],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("81,000"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "North Luzon Renewable Energy Corp. (NLR)",
      "reCat": getRECategory("Wind"),
      "reClass": "Commercial",
      "yearEst": "2025",
      "acquisition": "Awarded",
      "isNetMetered": "No",
      "isDer": "No",
      "ownUse": "No",
      "address": parseAddress("Brgy. Caparispisan, Pagudpud, Ilocos Norte"),
      "fit": {
        "eligible": true,
        "phase": "FIT1",
        "fitRef": "24-12-10-M-PAO-E-0350L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  },
  
  // Record 30: Northwind Power Development Corporation (NPDC)
  {
    "user": "64181decefd37e9800b2cddb",
    "previousUsers": [],
    "type": "Point",
    "coordinates": [120.7180925971103, 18.528577586878168],
    "images": [],
    "assessment": {
      "windUsage": "Power Generation",
      "capacity": convertCapacityToWatts("29,700"),
      "annualEnergyProduction": 0,
      "remarks": "",
      "status": "Operational"
    },
    "properties": {
      "ownerName": "Northwind Power Development Corporation (NPDC)",
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
        "fitRef": "25-06-04-M-PAO-E-0467L"
      }
    },
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "__v": 0
  }
]);

// Print summary
print("✅ Inserted additional 10 records (21-30) from luzon_wit_fit.json");
print("Total records in database: " + db.inventories.count());
print("📊 New additions include:");
print("   - Hedcor Irisan 1 & La Trinidad Hydro (Benguet)");
print("   - Isabela Biomass Energy Corp (Isabela)");
print("   - Labayat 1 Hydropower (Quezon)");
print("   - Luzon Hydro Corp - Bakun (Ilocos Sur)");
print("   - Majayjay Hydropower (Laguna)");
print("   - Mirae Asia Energy - Currimao Solar (Ilocos Norte)");
print("   - Montalban Methane Power (Rizal)");
print("   - North Luzon Renewable Energy - Caparispisan Wind (Ilocos Norte)");
print("   - Northwind Power - Bangui Bay Wind (Ilocos Norte)");
print("🚀 Your database now has even more diverse renewable energy projects!");

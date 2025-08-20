export const regions = [
  {
    name: 'Luzon',
    regions: [
      {
        name: 'Ilocos Region (Region I)',
        provinces: ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan']
      },
      {
        name: 'Cagayan Valley (Region II)',
        provinces: ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino']
      },
      {
        name: 'Central Luzon (Region III)',
        provinces: ['Aurora', 'Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales']
      },
      {
        name: 'CALABARZON (Region IV-A)',
        provinces: ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon']
      },
      {
        name: 'MIMAROPA (Region IV-B)',
        provinces: ['Occidental Mindoro', 'Oriental Mindoro', 'Marinduque', 'Romblon', 'Palawan']
      },
      {
        name: 'Bicol Region (Region V)',
        provinces: ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon']
      },
      {
        name: 'Cordillera Administrative Region (CAR)',
        provinces: ['Abra', 'Apayao', 'Benguet', 'Ifugao', 'Kalinga', 'Mountain Province']
      },
      {
        name: 'National Capital Region (NCR)',
        provinces: ['Metro Manila (16 cities + 1 municipality)']
      }
    ]
  },
  {
    name: 'Visayas',
    regions: [
      {
        name: 'Western Visayas (Region VI)',
        provinces: ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental']
      },
      {
        name: 'Central Visayas (Region VII)',
        provinces: ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor']
      },
      {
        name: 'Eastern Visayas (Region VIII)',
        provinces: ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte']
      }
    ]
  },
  {
    name: 'Mindanao',
    regions: [
      {
        name: 'Zamboanga Peninsula (Region IX)',
        provinces: ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay']
      },
      {
        name: 'Northern Mindanao (Region X)',
        provinces: ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental']
      },
      {
        name: 'Davao Region (Region XI)',
        provinces: ['Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Oriental', 'Davao Occidental']
      },
      {
        name: 'SOCCSKSARGEN (Region XII)',
        provinces: ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat']
      },
      {
        name: 'Caraga (Region XIII)',
        provinces: ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur']
      },
      {
        name: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
        provinces: ['Basilan', 'Lanao del Sur', 'Magindanao del Norte', 'Magindanao del Sur', 'Sulu', 'Tawi-Tawi', 'Cotabato City']
      }
    ]
  }
];

// Helper function to get all region names
export const getAllRegionNames = () => {
  return regions.flatMap(island => island.regions.map(region => region.name));
};

// Helper function to get provinces for a specific region
export const getProvincesForRegion = (regionName) => {
  for (const island of regions) {
    for (const region of island.regions) {
      if (region.name === regionName) {
        return region.provinces;
      }
    }
  }
  return [];
};

// Helper function to get island group for a region
export const getIslandGroupForRegion = (regionName) => {
  for (const island of regions) {
    for (const region of island.regions) {
      if (region.name === regionName) {
        return island.name;
      }
    }
  }
  return '';
};

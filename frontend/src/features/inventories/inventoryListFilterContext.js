import React, { createContext, useContext, useState, useEffect } from 'react';
import { reCats } from '../../config/reCats';
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, rawGeothermalUsage, Status, rawSolarPowerGenSubcategories } from '../../config/techAssesment';
import { useSelector } from 'react-redux';
import { useGetInventoryListSummaryQuery } from './inventoryListApiSlice';
import useAuth from '../../hooks/useAuth';
import { selectAllUsers } from '../users/usersApiSlice';
import { DEFAULT_AFFILIATIONS } from '../../config/affiliations';

const InventoryFilterContext = createContext();

export const useInventoryFilter = () => {
  return useContext(InventoryFilterContext);
};

export const InventoryFilterProvider = ({ children }) => {
  const { username, isAdmin } = useAuth();
  const { data: inventories = [] } = useGetInventoryListSummaryQuery({
    username,
    isAdmin,
    filters: {}
  });
  const users = useSelector(selectAllUsers);
  const contNames = reCats.map((type) => type.contName);
  
  // Filter states - initialize with all categories included (checked)
  const [filters, setFilters] = useState({ contNames: [] });
  const [category, setCategory] = useState([]);
  const [query, setQuery] = useState("");
  const [clearVal, setClearVal] = useState(false);
  const [uploaderFilter, setUploaderFilter] = useState([]);
  const [solarProvFilter, setSolarProvFilter] = useState([]);
  const [bioProvFilter, setBioProvFilter] = useState([]);
  const [windProvFilter, setWindProvFilter] = useState([]);
  const [geoProvFilter, setGeoProvFilter] = useState([]);
  const [solarUsageFilter, setSolarUsageFilter] = useState(rawSolarUsage.map(item => item.name));
  const [statusFilter, setStatusFilter] = useState(Status.map(item => item.name));
  const [biomassUsageFilter, setBiomassUsageFilter] = useState(rawBiomassPriUsage.map(item => item.name));
  const [windUsageFilter, setWindUsageFilter] = useState(rawWindUsage.map(item => item.name));
  const [geothermalUsageFilter, setGeothermalUsageFilter] = useState(rawGeothermalUsage.map(item => item.name));
  const [netMeteredFilter, setNetMeteredFilter] = useState([]);
  const [ownUseFilter, setOwnUseFilter] = useState([]);
  const [solarSystemTypeFilter, setSolarSystemTypeFilter] = useState(["Hybrid", "Off-grid", "Grid-tied"]);
  const [solarPowerGenSubcategoryFilter, setSolarPowerGenSubcategoryFilter] = useState([]);
  const [commercialFilter, setCommercialFilter] = useState("All"); // "All", "Commercial", "Non-Commercial"
  
  // Extract unique uploader names from inventory data
  const uploaderOptions = React.useMemo(() => {
    if (!inventories || inventories.length === 0) return [];
    return [...new Set(inventories.map(inv => inv.username).filter(Boolean))];
  }, [inventories]);

  // Group users by affiliation for enhanced filtering
  const usersByAffiliation = React.useMemo(() => {
    if (!users || users.length === 0) return {};
    
    const grouped = {};
    
    users.forEach(user => {
      const affiliation = user.affiliation || 'Not Affiliated';
      if (!grouped[affiliation]) {
        grouped[affiliation] = [];
      }
      
      // Determine display name - use company name for Installer users if available
      let displayName = user.fullName || user.username;
      let displaySecondary = user.username;
      
      if (user.roles && user.roles.includes('Installer') && user.companyName) {
        displayName = user.companyName;
        displaySecondary = `${user.fullName || user.username} (${user.username})`;
      }
      
      grouped[affiliation].push({
        username: user.username,
        fullName: user.fullName || user.username,
        affiliation: user.affiliation,
        companyName: user.companyName || '',
        roles: user.roles || [],
        displayName: displayName,
        displaySecondary: displaySecondary
      });
    });
    
    return grouped;
  }, [users]);

  // Group installers separately for easier access
  const installersGroup = React.useMemo(() => {
    if (!users || users.length === 0) return [];
    
    return users
      .filter(user => user.roles && user.roles.includes('Installer'))
      .map(user => {
        // Determine display name - use company name for Installer users if available
        let displayName = user.fullName || user.username;
        let displaySecondary = user.username;
        
        if (user.companyName) {
          displayName = user.companyName;
          displaySecondary = `${user.fullName || user.username} (${user.username})`;
        }
        
        return {
          username: user.username,
          fullName: user.fullName || user.username,
          affiliation: user.affiliation || 'Not Affiliated',
          companyName: user.companyName || '',
          roles: user.roles || [],
          displayName: displayName,
          displaySecondary: displaySecondary
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName)); // Sort by display name
  }, [users]);

  // Get all available affiliations (both from users and defaults)
  const availableAffiliations = React.useMemo(() => {
    const userAffiliations = Object.keys(usersByAffiliation);
    const defaultAffiliationCodes = DEFAULT_AFFILIATIONS.map(affil => affil.code);
    const allAffiliations = [...new Set([...userAffiliations, ...defaultAffiliationCodes, 'Not Affiliated'])];
    return allAffiliations.sort();
  }, [usersByAffiliation]);
  
  // Initialize categories unchecked by default
  useEffect(() => {
    const initialCategories = reCats.map(cat => ({ ...cat, checked: false }));
    setCategory(initialCategories);
  }, []);
  
  const clearAllFilters = () => {
    reCats.forEach((type) => type.checked = false);
    setClearVal(true);
    setFilters({ contNames: [] }); // Start with all categories included
    setCategory([...reCats]);
    setQuery("");
    setUploaderFilter([]);
    setSolarUsageFilter(rawSolarUsage.map(item => item.name));
    setStatusFilter(Status.map(item => item.name));
    setBiomassUsageFilter(rawBiomassPriUsage.map(item => item.name));
    setWindUsageFilter(rawWindUsage.map(item => item.name));
    setGeothermalUsageFilter(rawGeothermalUsage.map(item => item.name));
    setNetMeteredFilter([]);
    setOwnUseFilter([]);
    setSolarSystemTypeFilter(["Hybrid", "Off-grid", "Grid-tied"]);
    setSolarPowerGenSubcategoryFilter([]);
    setCommercialFilter("All");
  };

  const handleCategoryChange = (type, index) => {
    const updatedCategory = [...category];
    updatedCategory[index].checked = !updatedCategory[index].checked;
    setCategory(updatedCategory);
    
    if (filters.contNames.includes(type)) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        contNames: prevFilters.contNames.filter((f) => f !== type),
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        contNames: [...prevFilters.contNames, type],
      }));
    }
  };

  const filterInventories = (inventories) => {
    // Filter by city/municipality
    const searchFilter = (items) => {
      return items.filter((item) => {
        if (!query) return true;
        return ["city", "province"].some((param) => {
          const address = item.properties?.address;
          if (!address) return false;
          return address[param]?.toString().toLowerCase().includes(query.toLowerCase());
        });
      });
    };
    
    // Apply all filters
    return searchFilter(inventories).filter((inventory) => {
      // Make sure we have valid inventory data
      if (!inventory.properties || !inventory.properties.reCat) return false;
      
      // Uploader filter (treat "all" as no restriction)
      if (
        uploaderFilter.length > 0 &&
        !uploaderFilter.includes('all') &&
        !uploaderFilter.includes(inventory.username)
      ) return false;
      
      // Category filter - include only checked categories; if none selected, show none
      if (filters.contNames.length === 0) return false;
      if (!filters.contNames.includes(inventory.properties.reCat)) return false;
      
      // Commercial filter
      if (commercialFilter !== "All") {
        const inventoryClass = inventory.properties.reClass;
        // Only filter if reClass is explicitly set and doesn't match
        if (inventoryClass && commercialFilter !== inventoryClass) return false;
      }

      if (inventory.properties.reCat === 'Solar Energy') {
        const isPowerGen = solarUsageFilter.includes("Power Generation");
        return (
          solarUsageFilter.includes(inventory.assessment.solarUsage) &&
          statusFilter.includes(inventory.assessment.status) &&
          (netMeteredFilter.length === 0 || netMeteredFilter.includes(inventory.properties.isNetMetered)) &&
          (ownUseFilter.length === 0 || ownUseFilter.includes(inventory.properties.ownUse)) &&
          (!isPowerGen ||
            (isPowerGen && (
              solarSystemTypeFilter.length === 0 || 
              solarSystemTypeFilter.includes(inventory.assessment.solarSystemTypes)
            ))
          ) &&
          (!isPowerGen ||
            (isPowerGen && (
              solarPowerGenSubcategoryFilter.length === 0 || 
              (inventory.assessment.solarPowerGenSubcategory && 
               solarPowerGenSubcategoryFilter.includes(inventory.assessment.solarPowerGenSubcategory.mainCategory))
            ))
          )
        );
      }
      if (inventory.properties.reCat === 'Biomass') {
        return (
          (!inventory.assessment.biomassPriUsage || biomassUsageFilter.includes(inventory.assessment.biomassPriUsage)) &&
          statusFilter.includes(inventory.assessment.status)
        );
      }
      if (inventory.properties.reCat === 'Wind Energy') {
        return (
          (!inventory.assessment.windUsage || windUsageFilter.includes(inventory.assessment.windUsage)) &&
          statusFilter.includes(inventory.assessment.status)
        );
      }
      if (inventory.properties.reCat === 'Geothermal Energy') {
        return (
          (!inventory.assessment.geothermalUsage || geothermalUsageFilter.includes(inventory.assessment.geothermalUsage)) &&
          statusFilter.includes(inventory.assessment.status)
        );
      }
      if (inventory.properties.reCat === 'Hydropower') {
        return (
          statusFilter.includes(inventory.assessment.status)
        );
      }
      return false;
    });
  };

  const value = {
    // Filter states
    filters,
    category,
    query,
    clearVal,
    uploaderFilter,
    solarProvFilter,
    bioProvFilter,
    windProvFilter,
    geoProvFilter,
    solarUsageFilter,
    statusFilter,
    biomassUsageFilter,
    windUsageFilter,
    geothermalUsageFilter,
    netMeteredFilter,
    ownUseFilter,
    solarSystemTypeFilter,
    solarPowerGenSubcategoryFilter,
    commercialFilter,
    
    // Available options
    uploaderOptions,
    usersByAffiliation,
    installersGroup, // Add installersGroup to the context value
    availableAffiliations,
    
    // Setters
    setFilters,
    setCategory,
    setQuery,
    setClearVal,
    setUploaderFilter,
    setSolarProvFilter,
    setBioProvFilter,
    setWindProvFilter,
    setGeoProvFilter,
    setSolarUsageFilter, 
    setStatusFilter,
    setBiomassUsageFilter,
    setWindUsageFilter,
    setGeothermalUsageFilter,
    setNetMeteredFilter,
    setOwnUseFilter,
    setSolarSystemTypeFilter,
    setSolarPowerGenSubcategoryFilter,
    setCommercialFilter,
    
    // Helper functions
    clearAllFilters,
    handleCategoryChange,
    filterInventories,
    
    // Constants
    contNames,
  };
  
  return (
    <InventoryFilterContext.Provider value={value}>
      {children}
    </InventoryFilterContext.Provider>
  );
};
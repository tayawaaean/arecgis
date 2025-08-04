import React, { createContext, useContext, useState, useEffect } from 'react';
import { reCats } from '../../config/reCats';
import { rawSolarUsage, rawBiomassPriUsage, rawWindUsage, Status } from '../../config/techAssesment';
import { useSelector } from 'react-redux';
import { selectAllInventories } from './inventoriesApiSlice';

const InventoryFilterContext = createContext();

export const useInventoryFilter = () => {
  return useContext(InventoryFilterContext);
};

export const InventoryFilterProvider = ({ children }) => {
  const inventories = useSelector(selectAllInventories);
  const contNames = reCats.map((type) => type.contName);
  
  // Filter states
  const [filters, setFilters] = useState({ contNames });
  const [category, setCategory] = useState([]);
  const [query, setQuery] = useState("");
  const [clearVal, setClearVal] = useState(false);
  const [uploaderFilter, setUploaderFilter] = useState([]);
  const [solarProvFilter, setSolarProvFilter] = useState([]);
  const [bioProvFilter, setBioProvFilter] = useState([]);
  const [windProvFilter, setWindProvFilter] = useState([]);
  const [solarUsageFilter, setSolarUsageFilter] = useState(rawSolarUsage.map(item => item.name));
  const [statusFilter, setStatusFilter] = useState(Status.map(item => item.name));
  const [biomassUsageFilter, setBiomassUsageFilter] = useState(rawBiomassPriUsage.map(item => item.name));
  const [windUsageFilter, setWindUsageFilter] = useState(rawWindUsage.map(item => item.name));
  const [netMeteredFilter, setNetMeteredFilter] = useState([]);
  const [ownUseFilter, setOwnUseFilter] = useState([]);
  const [solarSystemTypeFilter, setSolarSystemTypeFilter] = useState(["Hybrid", "Off-grid", "Grid-tied"]);
  
  // Extract unique uploader names from inventory data
  const uploaderOptions = React.useMemo(() => {
    if (!inventories || inventories.length === 0) return [];
    return [...new Set(inventories.map(inv => inv.username).filter(Boolean))];
  }, [inventories]);
  
  // Initialize categories
  useEffect(() => {
    setCategory(reCats);
  }, []);
  
  const clearAllFilters = () => {
    reCats.forEach((type) => type.checked = false);
    setClearVal(true);
    setFilters({ contNames: contNames });
    setCategory([...reCats]);
    setQuery("");
    setUploaderFilter([]);
    setSolarUsageFilter(rawSolarUsage.map(item => item.name));
    setStatusFilter(Status.map(item => item.name));
    setBiomassUsageFilter(rawBiomassPriUsage.map(item => item.name));
    setWindUsageFilter(rawWindUsage.map(item => item.name));
    setNetMeteredFilter(['Yes', 'No']);
    setOwnUseFilter(['Yes', 'No']);
    setSolarSystemTypeFilter(["Hybrid", "Off-grid", "Grid-tied"]);
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
      
      // Uploader filter
      if (uploaderFilter.length > 0 && !uploaderFilter.includes(inventory.username)) return false;
      
      if (filters.contNames.includes(inventory.properties.reCat)) return false;

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
          )
        );
      }
      if (inventory.properties.reCat === 'Biomass') {
        return (
          biomassUsageFilter.includes(inventory.assessment.biomassPriUsage) &&
          statusFilter.includes(inventory.assessment.status)
        );
      }
      if (inventory.properties.reCat === 'Wind Energy') {
        return (
          windUsageFilter.includes(inventory.assessment.windUsage) &&
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
    solarUsageFilter,
    statusFilter,
    biomassUsageFilter,
    windUsageFilter,
    netMeteredFilter,
    ownUseFilter,
    solarSystemTypeFilter,
    
    // Available options
    uploaderOptions, // This is what was missing
    
    // Setters
    setFilters,
    setCategory,
    setQuery,
    setClearVal,
    setUploaderFilter,
    setSolarProvFilter,
    setBioProvFilter,
    setWindProvFilter,
    setSolarUsageFilter, 
    setStatusFilter,
    setBiomassUsageFilter,
    setWindUsageFilter,
    setNetMeteredFilter,
    setOwnUseFilter,
    setSolarSystemTypeFilter,
    
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
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllInventories } from "../inventories/inventoriesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  Container, useTheme, Divider, Grid, Card, CardContent, Tooltip, Fade,
  OutlinedInput, Checkbox, ListItemText, Alert, CircularProgress, Button, IconButton, Chip,
  Collapse, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AirIcon from '@mui/icons-material/Air';
import WaterIcon from '@mui/icons-material/Water';
import GrassIcon from '@mui/icons-material/Grass';
import HelpIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import { BarChart, LineChart } from '@mui/x-charts';
import useAuth from "../../hooks/useAuth";
import { DEFAULT_AFFILIATIONS } from "../../config/affiliations";
import ChartHelpModal from "../../components/ChartHelpModal";

const CO2_PER_KWH = 0.82;
const COAL_PER_KWH = 0.4;
const CO2_ABSORBED_PER_TREE_PER_YEAR = 21;

const chartOptions = [
  // General/Overview Charts
  { 
    value: "totalCap", 
    label: "Total Capacity Overview", 
    category: "all",
    description: "Shows monthly total capacity installation across all renewable energy types",
    icon: "📊"
  },
  { 
    value: "count", 
    label: "System Count Overview", 
    category: "all",
    description: "Displays the number of RE systems added each month",
    icon: "🔢"
  },
  
  // Solar Energy Charts
  { 
    value: "solarSt", 
    label: "Solar Streetlights", 
    category: "Solar Energy",
    description: "Monthly solar streetlight capacity trends (kWp)",
    icon: "💡"
  },
  { 
    value: "powerGen", 
    label: "Solar Power Generation", 
    category: "Solar Energy",
    description: "Monthly solar power generation capacity trends (kWp)",
    icon: "☀️"
  },
  { 
    value: "pump", 
    label: "Solar Pumps", 
    category: "Solar Energy",
    description: "Monthly solar pump capacity trends (kWp)",
    icon: "🚰"
  },
  { 
    value: "powerGenAEP", 
    label: "Solar Annual Energy Production", 
    category: "Solar Energy",
    description: "Monthly solar energy production trends (kWh)",
    icon: "⚡"
  },
  
  // Other RE Types
  { 
    value: "wind", 
    label: "Wind Energy", 
    category: "Wind Energy",
    description: "Monthly wind energy capacity trends (kWp)",
    icon: "💨"
  },
  { 
    value: "hydro", 
    label: "Hydropower", 
    category: "Hydropower",
    description: "Monthly hydropower capacity trends (kWp)",
    icon: "🌊"
  },
  { 
    value: "biomass", 
    label: "Biomass", 
    category: "Biomass",
    description: "Monthly biomass capacity trends (kWp)",
    icon: "🌱"
  }
];

const reClassOptions = [
  { value: "all", label: "All (Commercial & Non-Commercial)" },
  { value: "Commercial", label: "Commercial Only" },
  { value: "Non-Commercial", label: "Non-Commercial Only" }
];

const reCatOptions = [
  { value: "all", label: "All Categories" },
  { value: "Solar Energy", label: "Solar Energy" },
  { value: "Wind Energy", label: "Wind Energy" },
  { value: "Hydropower", label: "Hydropower" },
  { value: "Biomass", label: "Biomass" }
];

const statusOptions = [
  "Operational",
  "For Repair",
  "Condemable"
];

function getYearOptionsFromInventories(inventories) {
  const years = new Set();
  inventories.forEach(inv => {
    let year = inv.properties?.yearEst;
    if (!year && inv.createdAt) year = new Date(inv.createdAt).getFullYear();
    if (year) years.add(year.toString());
  });
  return Array.from(years).sort();
}

function getMonthLabel(monthIdx) {
  return [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][monthIdx];
}

function groupAggregates(inventories) {
  const perMonth = {};
  let solarStTotalCap = 0, solarPowerGenTotalCap = 0, solarPumpTotalCap = 0;
  let windTotalCap = 0, hydroTotalCap = 0, biomassTotalCap = 0;
  let solarPowerGenTotalAEP = 0;
  let realTotalCapacity = 0;
  let totalUnits = 0;
  let totalSystems = 0, operationalSystems = 0;

  const inventoryAddedPerMonth = {};
  const totalCapacityPerMonth = {};

  inventories.forEach(inv => {
    if (!inv.createdAt) return;
    totalSystems += 1;
    if (inv.assessment?.status === "Operational") operationalSystems += 1;

    const date = new Date(inv.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    let unitsThisInv = 0;
    const reCat = inv.properties?.reCat || "Solar Energy"; // Default to Solar Energy if not specified

    // Initialize month data structure if not exists
    perMonth[monthKey] = perMonth[monthKey] || { 
      solarSt: { cap: 0, count: 0 }, 
      powerGen: { cap: 0, aep: 0, count: 0 }, 
      pump: { cap: 0, count: 0 },
      wind: { cap: 0, count: 0 },
      hydro: { cap: 0, count: 0 },
      biomass: { cap: 0, count: 0 }
    };

    // Process based on RE category
    if (reCat === "Solar Energy") {
      if (inv.assessment?.solarStreetLights) {
        const rawSolarItems = inv.assessment.solarStreetLights;
        const totalPcs = rawSolarItems.reduce((sum, item) => sum + (Number(item.pcs) || 0), 0);
        const totalCap = rawSolarItems.reduce(
          (sum, item) => sum + (Number(item.capacity) * Number(item.pcs)), 0
        );
        solarStTotalCap += totalCap;
        perMonth[monthKey].solarSt.cap += totalCap;
        perMonth[monthKey].solarSt.count += totalPcs;
        realTotalCapacity += totalCap;
        unitsThisInv += totalPcs;
      }

      const cap = Number(inv.assessment?.capacity) || 0;
      if (inv.assessment?.solarUsage === "Power Generation") {
        solarPowerGenTotalCap += cap;
        perMonth[monthKey].powerGen.cap += cap;
        perMonth[monthKey].powerGen.count += 1;
        const aep = Number(inv.assessment.annualEnergyProduction) || 0;
        solarPowerGenTotalAEP += aep;
        perMonth[monthKey].powerGen.aep += aep;
        if (!inv.assessment?.solarStreetLights) {
          realTotalCapacity += cap;
        }
        unitsThisInv += 1;
      } else if (inv.assessment?.solarUsage === "Solar Pump") {
        solarPumpTotalCap += cap;
        perMonth[monthKey].pump.cap += cap;
        perMonth[monthKey].pump.count += 1;
        if (!inv.assessment?.solarStreetLights) {
          realTotalCapacity += cap;
        }
        unitsThisInv += 1;
      } else if (!inv.assessment?.solarStreetLights) {
        realTotalCapacity += cap;
        unitsThisInv += 1;
      }
    } else if (reCat === "Wind Energy") {
      const cap = Number(inv.assessment?.capacity) || 0;
      windTotalCap += cap;
      perMonth[monthKey].wind.cap += cap;
      perMonth[monthKey].wind.count += 1;
      realTotalCapacity += cap;
      unitsThisInv += 1;
    } else if (reCat === "Hydropower") {
      const cap = Number(inv.assessment?.capacity) || 0;
      hydroTotalCap += cap;
      perMonth[monthKey].hydro.cap += cap;
      perMonth[monthKey].hydro.count += 1;
      realTotalCapacity += cap;
      unitsThisInv += 1;
    } else if (reCat === "Biomass") {
      const cap = Number(inv.assessment?.capacity) || 0;
      biomassTotalCap += cap;
      perMonth[monthKey].biomass.cap += cap;
      perMonth[monthKey].biomass.count += 1;
      realTotalCapacity += cap;
      unitsThisInv += 1;
    } else {
      // For any other category
      const cap = Number(inv.assessment?.capacity) || 0;
      if (cap > 0) {
        realTotalCapacity += cap;
        unitsThisInv += 1;
      }
    }

    totalUnits += unitsThisInv;

    inventoryAddedPerMonth[monthKey] = (inventoryAddedPerMonth[monthKey] || 0) + 1;
    totalCapacityPerMonth[monthKey] = (totalCapacityPerMonth[monthKey] || 0) + (Number(inv.assessment?.capacity) || 0);
  });

  const allMonthKeys = Array.from(
    new Set([
      ...Object.keys(perMonth),
      ...Object.keys(inventoryAddedPerMonth),
      ...Object.keys(totalCapacityPerMonth),
    ])
  ).sort();
  const xLabels = allMonthKeys.map(key => {
    const [y, m] = key.split("-");
    return `${getMonthLabel(Number(m) - 1)} '${y.slice(-2)}`;
  });

  const solarStCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.solarSt.cap || 0) / 1000))
    : [];
  const powerGenCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.powerGen.cap || 0) / 1000))
    : [];
  const pumpCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.pump.cap || 0) / 1000))
    : [];
  const windCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.wind.cap || 0) / 1000))
    : [];
  const hydroCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.hydro.cap || 0) / 1000))
    : [];
  const biomassCapSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => ((perMonth[key]?.biomass.cap || 0) / 1000))
    : [];
  const powerGenAEPSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => (perMonth[key]?.powerGen.aep || 0))
    : [];
  const countSeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => inventoryAddedPerMonth[key] || 0)
    : [];
  const totalCapacitySeries = allMonthKeys.length > 0
    ? allMonthKeys.map(key => (totalCapacityPerMonth[key] || 0) / 1000)
    : [];

  const estimatedKWhPerYear = realTotalCapacity / 1000 * 1400;
  const co2SavedKg = estimatedKWhPerYear * CO2_PER_KWH;
  const coalSavedKg = estimatedKWhPerYear * COAL_PER_KWH;
  const treesEquivalent = co2SavedKg / CO2_ABSORBED_PER_TREE_PER_YEAR;

  const uptimeRate = totalSystems ? (operationalSystems / totalSystems) * 100 : 0;

  return {
    xLabels,
    solarStTotalCap,
    solarPowerGenTotalCap,
    solarPumpTotalCap,
    windTotalCap,
    hydroTotalCap,
    biomassTotalCap,
    solarPowerGenTotalAEP,
    solarStCapSeries,
    powerGenCapSeries,
    pumpCapSeries,
    windCapSeries,
    hydroCapSeries,
    biomassCapSeries,
    powerGenAEPSeries,
    countSeries,
    totalCapacitySeries,
    realTotalCapacity,
    totalUnits,
    co2SavedKg,
    coalSavedKg,
    treesEquivalent,
    uptimeRate,
    totalSystems,
    operationalSystems,
  };
}

const numberFormat = (num, unit) => {
  if (unit === "MW") return (num / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " MW";
  if (unit === "tons") return (num / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + " tons";
  if (unit === "trees") return Math.round(num).toLocaleString() + " trees";
  if (unit === "kWh") return Number(num).toLocaleString() + " kWh";
  if (unit === "kWp") return (num / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " kWp";
  if (typeof num === "number") return Number(num).toLocaleString();
  return num;
};

const getChartSubtitle = ({
  selectedChart,
  solarStTotalCap,
  solarPowerGenTotalCap,
  solarPumpTotalCap,
  windTotalCap,
  hydroTotalCap,
  biomassTotalCap,
  solarPowerGenTotalAEP,
  realTotalCapacity,
}) => {
  switch (selectedChart) {
    case "solarSt":      return `Total: ${numberFormat(solarStTotalCap, "MW")}`;
    case "powerGen":     return `Total: ${numberFormat(solarPowerGenTotalCap, "MW")}`;
    case "pump":         return `Total: ${numberFormat(solarPumpTotalCap, "MW")}`;
    case "wind":         return `Total: ${numberFormat(windTotalCap, "MW")}`;
    case "hydro":        return `Total: ${numberFormat(hydroTotalCap, "MW")}`;
    case "biomass":      return `Total: ${numberFormat(biomassTotalCap, "MW")}`;
    case "powerGenAEP":  return `Total Declared Annual Energy Prod. (Power Gen): ${numberFormat(solarPowerGenTotalAEP, "kWh")}`;
    case "count":        return `Grand Total Capacity: ${numberFormat(
      solarStTotalCap + solarPowerGenTotalCap + solarPumpTotalCap + 
      windTotalCap + hydroTotalCap + biomassTotalCap, "MW")}`;
    case "totalCap":     return `Total Installed Capacity: ${numberFormat(realTotalCapacity, "MW")}`;
    default:             return "";
  }
};

const metricCards = [
  {
    label: "Total Capacity",
    icon: <EnergySavingsLeafIcon fontSize="large" color="success" />,
    key: "realTotalCapacity",
    unit: "MW",
    tooltip: "Total installed capacity (all types, MW)."
  },
  {
    label: "Total Units Installed",
    icon: <ScatterPlotIcon fontSize="large" color="info" />,
    key: "totalUnits",
    unit: "",
    tooltip: "Total number of units (all types)."
  },
  {
    label: "CO₂ Emissions Avoided",
    icon: <CloudQueueIcon fontSize="large" color="primary" />,
    key: "co2SavedKg",
    unit: "tons",
    tooltip: "Estimated CO₂ emissions avoided by all installations per year."
  },
  {
    label: "Equivalent Trees Planted",
    icon: <NaturePeopleIcon fontSize="large" color="success" />,
    key: "treesEquivalent",
    unit: "trees",
    tooltip: "Equivalent number of trees needed to absorb the same CO₂ emissions per year."
  },
  {
    label: "Coal Saved",
    icon: <LocalShippingIcon fontSize="large" sx={{ color: "#a1887f" }} />,
    key: "coalSavedKg",
    unit: "tons",
    tooltip: "Estimated coal saved (in tons) per year."
  },
  {
    label: "Uptime / Operational Rate",
    icon: <CheckCircleIcon fontSize="large" color="success" />,
    key: "uptimeRate",
    unit: "%",
    tooltip: "Percentage of systems currently operational.",
    renderValue: (val, {operationalSystems, totalSystems}) => `${val.toFixed(1)}% (${operationalSystems}/${totalSystems})`
  }
];

function MultiFilter({
  chartOptions,
  selectedChart, setSelectedChart,
  showOtherFilters,
  regionOptions, regionValue, setRegionValue,
  yearOptions, yearValue, setYearValue,
  selectedReClass, setSelectedReClass,
  reClassOptionsFiltered,
  selectedReCat, setSelectedReCat,
  reCatOptionsFiltered,
  uploaderOptions, uploaderFilter, setUploaderFilter,
  statusFilter, setStatusFilter,
  isAdminOrManager, username,
  usersByAffiliation, availableAffiliations,
  installersGroup
}) {
  const theme = useTheme();
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Filter chart options based on selected RE category
  const filteredChartOptions = selectedReCat === "all" 
    ? chartOptions 
    : chartOptions.filter(opt => opt.category === "all" || opt.category === selectedReCat);

  // Check if current chart selection is valid for selected RE category
  const isSelectedChartValid = selectedReCat === "all" || 
    chartOptions.find(opt => opt.value === selectedChart)?.category === "all" ||
    chartOptions.find(opt => opt.value === selectedChart)?.category === selectedReCat;

  // Helper function to handle affiliation selection
  const handleAffiliationSelect = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    
    // Check if all users in this affiliation are already selected
    const allSelected = usernames.every(username => uploaderFilter.includes(username));
    
    if (allSelected) {
      // Remove all users from this affiliation
      const newFilter = uploaderFilter.filter(username => !usernames.includes(username));
      setUploaderFilter(newFilter);
    } else {
      // Add all users from this affiliation
      const newFilter = [...new Set([...uploaderFilter, ...usernames])];
      setUploaderFilter(newFilter);
    }
  };

  // Helper function to check if entire affiliation is selected
  const isAffiliationSelected = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    const result = usernames.length > 0 && usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to check if affiliation is partially selected
  const isAffiliationPartiallySelected = (affiliation) => {
    const usersInAffiliation = usersByAffiliation[affiliation] || [];
    const usernames = usersInAffiliation.map(user => user.username);
    const result = usernames.some(username => uploaderFilter.includes(username)) && 
           !usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to handle installer selection
  const handleInstallersSelect = () => {
    const usernames = installersGroup.map(user => user.username);
    
    // Check if all installers are already selected
    const allSelected = usernames.every(username => uploaderFilter.includes(username));
    
    if (allSelected) {
      // Remove all installers
      const newFilter = uploaderFilter.filter(username => !usernames.includes(username));
      setUploaderFilter(newFilter);
    } else {
      // Add all installers
      const newFilter = [...new Set([...uploaderFilter, ...usernames])];
      setUploaderFilter(newFilter);
    }
  };

  // Helper function to check if all installers are selected
  const isInstallersSelected = () => {
    const usernames = installersGroup.map(user => user.username);
    const result = usernames.length > 0 && usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  // Helper function to check if installers are partially selected
  const isInstallersPartiallySelected = () => {
    const usernames = installersGroup.map(user => user.username);
    const result = usernames.some(username => uploaderFilter.includes(username)) && 
           !usernames.every(username => uploaderFilter.includes(username));
    return result;
  };

  return (
    <Accordion 
      expanded={filtersExpanded} 
      onChange={(event, isExpanded) => setFiltersExpanded(isExpanded)}
      sx={{
      background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      borderRadius: 3,
        mb: 2,
      border: "1px solid rgba(148, 163, 184, 0.2)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: '0 0 16px 0' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px 12px 0 0',
          minHeight: 48,
          '&.Mui-expanded': { minHeight: 48 },
          '& .MuiAccordionSummary-content': { margin: '8px 0' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <FilterListIcon color="primary" />
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        color: "text.primary",
        fontSize: '1rem'
      }}>
        🔍 Filter Options
      </Typography>
          <Chip 
            label={selectedChart ? chartOptions.find(opt => opt.value === selectedChart)?.label || 'Chart Selected' : 'No Chart'} 
            size="small" 
            color={selectedChart ? "primary" : "default"}
            variant="outlined"
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ pt: 0 }}>
        {/* Quick Start Guide - Only show when expanded */}
      <Box sx={{ 
        mb: 2, 
        p: 1.5, 
        backgroundColor: 'rgba(25, 118, 210, 0.08)', 
        borderRadius: 1.5,
        border: '1px solid rgba(25, 118, 210, 0.2)'
      }}>
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          fontSize: '0.8rem',
          lineHeight: 1.4
        }}>
            <strong>💡 Quick Start:</strong> Select an RE Category and Chart Type. Additional filters appear below when needed.
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {/* Row 1: Main Filters - Always Visible */}
        <Grid item xs={12} md={3}>
          {/* RE Category Filter */}
          <FormControl fullWidth disabled={isAdminOrManager ? (uploaderFilter.length === 0) : false}>
            <Tooltip 
              title="Select a renewable energy category to filter available chart types. Choose 'All Categories' to see all chart options." 
              placement="top" 
              arrow
            >
              <InputLabel id="recat-selector-label" sx={{ fontWeight: 500 }}>⚡ RE Category</InputLabel>
            </Tooltip>
            <Select
              labelId="recat-selector-label"
              value={selectedReCat}
              onChange={e => {
                const newReCat = e.target.value;
                setSelectedReCat(newReCat);
                
                // If the current chart selection doesn't match the new RE category, reset to default
                const currentChartOption = chartOptions.find(opt => opt.value === selectedChart);
                if (newReCat !== "all" && currentChartOption?.category !== "all" && currentChartOption?.category !== newReCat) {
                  // Find a valid chart for this category or default to "totalCap"
                  const validChart = chartOptions.find(opt => opt.category === newReCat)?.value || "totalCap";
                  setSelectedChart(validChart);
                }
              }}
              input={<OutlinedInput 
                label="⚡ RE Category" 
                sx={{ borderRadius: 2 }}
              />}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                }
              }}
            >
              {reCatOptionsFiltered.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          {/* Chart selector: always visible */}
          <FormControl fullWidth disabled={isAdminOrManager ? (uploaderFilter.length === 0) : false}>
            <Tooltip 
              title="Choose the type of chart to display. Options are filtered based on your RE Category selection." 
              placement="top" 
              arrow
            >
              <InputLabel id="chart-selector-label" sx={{ fontWeight: 500 }}>📊 Chart Type</InputLabel>
            </Tooltip>
            <Select
              labelId="chart-selector-label"
              value={isSelectedChartValid ? selectedChart : "totalCap"}
              onChange={e => setSelectedChart(e.target.value)}
              input={<OutlinedInput 
                label="📊 Chart Type" 
                sx={{ borderRadius: 2 }}
              />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 500,
                    width: 400,
                  },
                },
              }}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                }
              }}
            >
              {/* Group chart options by category */}
              {(() => {
                const groupedOptions = {};
                filteredChartOptions.forEach(option => {
                  const category = option.category === 'all' ? 'General Overview' : option.category;
                  if (!groupedOptions[category]) {
                    groupedOptions[category] = [];
                  }
                  groupedOptions[category].push(option);
                });

                const result = [];
                Object.entries(groupedOptions).forEach(([category, options]) => {
                  // Category header
                  result.push(
                    <MenuItem 
                      key={`header-${category}`} 
                      disabled
                      sx={{ 
                        backgroundColor: theme.palette.grey[100], 
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        borderBottom: `1px solid ${theme.palette.grey[300]}`,
                        cursor: 'default',
                        '&:hover': { backgroundColor: theme.palette.grey[100] }
                      }}
                    >
                      {category === 'General Overview' ? '📊 General Overview' : 
                       category === 'Solar Energy' ? '☀️ Solar Energy' :
                       category === 'Wind Energy' ? '💨 Wind Energy' :
                       category === 'Hydropower' ? '🌊 Hydropower' :
                       category === 'Biomass' ? '🌱 Biomass' : category}
                    </MenuItem>
                  );
                  
                  // Chart options under this category
                  options.forEach(option => {
                    result.push(
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        sx={{ 
                          pl: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          py: 1.5
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                            {option.icon} {option.label}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            pl: 1,
                            fontSize: '0.75rem',
                            lineHeight: 1.2,
                            fontStyle: 'italic'
                          }}
                        >
                          {option.description}
                        </Typography>
                      </MenuItem>
                    );
                  });
                });
                
                return result;
              })()}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          {/* Region Filter */}
          <FormControl fullWidth>
            <Tooltip 
              title="Filter data by specific region. Leave as 'All Regions' to see data from all locations." 
              placement="top" 
              arrow
            >
              <InputLabel id="region-selector-label" sx={{ fontWeight: 500 }}>📍 Region</InputLabel>
            </Tooltip>
            <Select
              labelId="region-selector-label"
              value={regionValue}
              onChange={e => setRegionValue(e.target.value)}
              input={<OutlinedInput 
                label="📍 Region" 
                sx={{ 
                  borderRadius: 2,
                  "&:hover": { borderColor: theme.palette.primary.main }
                }}
              />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 300,
                  },
                },
              }}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                }
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    🌍 All Regions
                  </Typography>
                </Box>
              </MenuItem>
              {regionOptions.length === 0 ? (
                <MenuItem value="" disabled>
                  <Typography variant="body2" color="text.secondary">
                    📭 No regions available
                  </Typography>
                </MenuItem>
              ) : (
                regionOptions.map(region => (
                  <MenuItem key={region} value={region}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">📍 {region}</Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          {/* Year Filter */}
          <FormControl fullWidth>
            <Tooltip 
              title="Filter data by establishment year. Leave as 'All Years' to see data from all time periods." 
              placement="top" 
              arrow
            >
              <InputLabel id="year-selector-label" sx={{ fontWeight: 500 }}>📅 Year</InputLabel>
            </Tooltip>
            <Select
              labelId="year-selector-label"
              value={yearValue}
              onChange={e => setYearValue(e.target.value)}
              input={<OutlinedInput 
                label="📅 Year" 
                sx={{ borderRadius: 2 }}
              />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    width: 300,
                  },
                },
              }}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                }
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    📅 All Years
                  </Typography>
                </Box>
              </MenuItem>
              {yearOptions.length === 0 ? (
                <MenuItem value="" disabled>
                  <Typography variant="body2" color="text.secondary">
                    📭 No years available
                  </Typography>
                </MenuItem>
              ) : (
                yearOptions.map(year => (
                  <MenuItem key={year} value={year}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">📅 {year}</Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Row 2: Additional Filters - Only when chart is selected */}
        {showOtherFilters && selectedChart && (
          <>
            <Grid item xs={12} md={3}>
              {/* Uploader selector: only for admin/manager */}
              {isAdminOrManager && (
                <FormControl fullWidth>
                  <InputLabel id="uploader-selector-label" sx={{ fontWeight: 500 }}>👤 Uploader</InputLabel>
                  <Select
                    labelId="uploader-selector-label"
                    multiple
                    value={uploaderFilter}
                                    onChange={e => {
                  const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                  
                  // Don't handle "all" here since we're handling it in the checkbox onClick
                  // Just filter out "all" and set the filter
                  const filteredValue = value.filter(v => v !== "all");
                  setUploaderFilter(filteredValue);
                }}
                    input={<OutlinedInput 
                      label="👤 Uploader" 
                      sx={{ 
                        borderRadius: 2,
                        "&:hover": { borderColor: theme.palette.primary.main }
                      }}
                    />}
                    renderValue={selected => {

                      if (selected.includes("all")) {
                        return "All Uploaders";
                      } else if (selected.length === 0) {
                        return "Select Uploaders";
                      } else {
                        return selected.join(', ');
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 400,
                          width: 400,
                        },
                      },
                    }}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                      }
                    }}
                  >
                    <MenuItem value="all">
                      <Checkbox 
                        checked={uploaderFilter.includes("all")} 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (uploaderFilter.includes("all")) {
                            setUploaderFilter([]);
                          } else {
                            setUploaderFilter(["all"]);
                          }
                        }}
                      />
                      <ListItemText primary="All Uploaders" />
                    </MenuItem>
                    
                    {/* Installers Section - Show first for easy access */}
                    {installersGroup.length > 0 && [
                      /* Installers header - NOT selectable, just for grouping */
                      <MenuItem 
                        key="installers-header" 
                        sx={{ 
                          backgroundColor: '#e3f2fd', 
                          fontWeight: 'bold',
                          borderBottom: '1px solid #2196f3',
                          color: '#1976d2',
                          cursor: 'default',
                          '&:hover': { backgroundColor: '#e3f2fd' }
                        }}
                      >
                        <Checkbox 
                          checked={isInstallersSelected()}
                          indeterminate={isInstallersPartiallySelected()}
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstallersSelect();
                          }}
                        />
                        <ListItemText 
                          primary={`🏗️ Installers (${installersGroup.length} companies)`}
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                      </MenuItem>,
                      /* Individual installers */
                      ...installersGroup.map((user) => (
                        <MenuItem 
                          key={`installer-${user.username}`} 
                          value={user.username}
                          sx={{ pl: 4, backgroundColor: '#f8f9fa' }}
                        >
                          <Checkbox 
                            checked={uploaderFilter.includes("all") || uploaderFilter.includes(user.username)} 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (uploaderFilter.includes(user.username)) {
                                setUploaderFilter(prev => prev.filter(u => u !== user.username));
                              } else {
                                setUploaderFilter(prev => [...prev, user.username]);
                              }
                            }}
                          />
                          <ListItemText 
                            primary={user.displayName || user.fullName}
                            secondary={user.displaySecondary || user.username}
                          />
                        </MenuItem>
                      )),
                      /* Divider between installers and affiliations */
                      <Divider key="installers-divider" sx={{ my: 1, borderColor: '#e0e0e0' }} />
                    ]}
                    
                    {/* Affiliations Section */}
                    {availableAffiliations.map((affiliation) => {
                      const usersInAffiliation = usersByAffiliation[affiliation] || [];
                      const affiliationSelected = isAffiliationSelected(affiliation);
                      const affiliationPartiallySelected = isAffiliationPartiallySelected(affiliation);
                      
                      return [
                        // Affiliation header - NOT selectable, just for grouping
                        <MenuItem 
                          key={`affiliation-${affiliation}`} 
                          sx={{ 
                            backgroundColor: '#f5f5f5', 
                            fontWeight: 'bold',
                            borderBottom: '1px solid #e0e0e0',
                            cursor: 'default',
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <Checkbox 
                            checked={affiliationSelected}
                            indeterminate={affiliationPartiallySelected}
                            size="small"
                            color="primary"
                                                    onClick={(e) => {
                          e.stopPropagation();
                          handleAffiliationSelect(affiliation);
                        }}
                          />
                          <ListItemText 
                            primary={`${affiliation} (${usersInAffiliation.length} users)`}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </MenuItem>,
                        // Individual users under this affiliation
                        ...usersInAffiliation.map((user) => (
                          <MenuItem 
                            key={user.username} 
                            value={user.username}
                            sx={{ pl: 4 }}
                          >
                            <Checkbox 
                              checked={uploaderFilter.includes("all") || uploaderFilter.includes(user.username)} 
                              color="primary"
                                                        onClick={(e) => {
                            e.stopPropagation();
                            if (uploaderFilter.includes(user.username)) {
                              setUploaderFilter(prev => prev.filter(u => u !== user.username));
                            } else {
                              setUploaderFilter(prev => [...prev, user.username]);
                            }
                          }}
                            />
                            <ListItemText 
                              primary={user.displayName || user.fullName}
                              secondary={user.displaySecondary || user.username}
                            />
                          </MenuItem>
                        ))
                      ];
                    }).flat()}
                  </Select>
                </FormControl>
              )}
            </Grid>
            
            <Grid item xs={12} md={3}>
              {/* RE Class Filter */}
              <FormControl fullWidth>
                <Tooltip 
                  title="Filter by renewable energy classification (e.g., Residential, Commercial, Industrial)" 
                  placement="top" 
                  arrow
                >
                  <InputLabel id="reclass-selector-label" sx={{ fontWeight: 500 }}>🏢 RE Class</InputLabel>
                </Tooltip>
                <Select
                  labelId="reclass-selector-label"
                  value={selectedReClass}
                  onChange={e => setSelectedReClass(e.target.value)}
                  input={<OutlinedInput 
                    label="🏢 RE Class" 
                    sx={{ 
                      borderRadius: 2,
                      "&:hover": { borderColor: theme.palette.primary.main }
                    }}
                  />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 300,
                      },
                    },
                  }}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                    }
                  }}
                >
                  {reClassOptionsFiltered.length === 0 ? (
                    <MenuItem value="" disabled>
                      <Typography variant="body2" color="text.secondary">
                        📭 No classes available
                      </Typography>
                    </MenuItem>
                  ) : (
                    reClassOptionsFiltered.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">🏢 {option.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              {/* Status filter */}
              <FormControl fullWidth>
                <Tooltip 
                  title="Filter by operational status of renewable energy systems" 
                  placement="top" 
                  arrow
                >
                  <InputLabel id="status-selector-label" sx={{ fontWeight: 500 }}>🔧 Status</InputLabel>
                </Tooltip>
                <Select
                  labelId="status-selector-label"
                  multiple
                  value={statusFilter}
                  onChange={e => {
                    const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                    setStatusFilter(value);
                  }}
                  input={<OutlinedInput 
                    label="🔧 Status" 
                    sx={{ 
                      borderRadius: 2,
                      "&:hover": { borderColor: theme.palette.primary.main }
                    }}
                  />}
                  renderValue={selected => selected.join(', ')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 300,
                      },
                    },
                  }}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
                    }
                  }}
                >
                  {["Operational", "For Repair", "Condemable"].map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={statusFilter.includes(status)} color="primary" />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

const Charts = () => {
  const { username, isManager, isAdmin } = useAuth();
  const isAdminOrManager = isManager || isAdmin;
  const rawinventories = useSelector(selectAllInventories);

  let inventories;
  if (isAdminOrManager) {
    inventories = [...rawinventories];
  } else {
    inventories = rawinventories.filter(inv => inv.username === username);
  }

  const users = useSelector(selectAllUsers);
  const theme = useTheme();

  // Group users by affiliation for enhanced filtering
  const usersByAffiliation = useMemo(() => {
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
  const installersGroup = useMemo(() => {
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
  const availableAffiliations = useMemo(() => {
    const userAffiliations = Object.keys(usersByAffiliation);
    const defaultAffiliationCodes = DEFAULT_AFFILIATIONS.map(affil => affil.code);
    const allAffiliations = [...new Set([...userAffiliations, ...defaultAffiliationCodes, 'Not Affiliated'])];
    return allAffiliations.sort();
  }, [usersByAffiliation]);

  // Uploader options with "all" at the top
  const uploaderOptions = isAdminOrManager
    ? Array.from(new Set(inventories.map(inv => inv.username).filter(Boolean)))
    : [];

  // Default: show data immediately for non-admin users, require selection for admin
  const [uploaderFilter, setUploaderFilter] = useState(isAdminOrManager ? [] : ["all"]);
  const [selectedChart, setSelectedChart] = useState("totalCap");
  const [regionValue, setRegionValue] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [selectedReClass, setSelectedReClass] = useState("all");
  const [selectedReCat, setSelectedReCat] = useState("all");
  const [statusFilter, setStatusFilter] = useState(["Operational", "For Repair", "Condemable"]);
  
  // Help modal state
  const [openHelpModal, setOpenHelpModal] = useState(false);
  
  // Help modal handlers
  const handleOpenHelpModal = () => setOpenHelpModal(true);
  const handleCloseHelpModal = () => setOpenHelpModal(false);

  let inventoriesForFilter = inventories.filter(inv => {
    if (
      isAdminOrManager &&
      uploaderFilter.length > 0 &&
      !uploaderFilter.includes("all") &&
      !uploaderFilter.includes(inv.username)
    ) return false;
    if (!selectedChart) return true;
    if (selectedReClass !== "all" && inv?.properties?.reClass !== selectedReClass) return false;
    if (selectedReCat !== "all" && inv?.properties?.reCat !== selectedReCat) return false;
    if (regionValue && inv.properties?.address?.region !== regionValue) return false;
    if (yearValue) {
      let invYear = inv.properties?.yearEst || (inv.createdAt && new Date(inv.createdAt).getFullYear().toString());
      if (invYear !== yearValue) return false;
    }
    if (statusFilter.length > 0 && !statusFilter.includes(inv.assessment?.status)) return false;
    return true;
  });

  const regionOptions = Array.from(
    new Set(inventoriesForFilter.map(inv => inv.properties?.address?.region).filter(Boolean))
  ).sort();

  const yearOptions = getYearOptionsFromInventories(inventoriesForFilter);

  const reClassOptionsFiltered = Array.from(
    new Set(inventoriesForFilter.map(inv => inv.properties?.reClass).filter(Boolean))
  ).map(v => reClassOptions.find(o => o.value === v) || { value: v, label: v });
  if (!reClassOptionsFiltered.find(x => x.value === "all")) {
    reClassOptionsFiltered.unshift(reClassOptions[0]);
  }

  const reCatOptionsFiltered = [
    reCatOptions[0], // "All Categories"
    ...Array.from(
      new Set(inventoriesForFilter.map(inv => inv.properties?.reCat).filter(Boolean))
    ).map(v => reCatOptions.find(o => o.value === v) || { value: v, label: v })
  ];

  const filteredInventories = inventories.filter(inv => {
    if (
      isAdminOrManager &&
      uploaderFilter.length > 0 &&
      !uploaderFilter.includes("all") &&
      !uploaderFilter.includes(inv.username)
    ) return false;
    if (!selectedChart) return false;
    if (selectedReClass !== "all" && inv?.properties?.reClass !== selectedReClass) return false;
    if (selectedReCat !== "all" && inv?.properties?.reCat !== selectedReCat) return false;
    if (regionValue && inv.properties?.address?.region !== regionValue) return false;
    if (yearValue) {
      let invYear = inv.properties?.yearEst || (inv.createdAt && new Date(inv.createdAt).getFullYear().toString());
      if (invYear !== yearValue) return false;
    }
    if (statusFilter.length > 0 && !statusFilter.includes(inv.assessment?.status)) return false;
    return true;
  });

  const {
    xLabels,
    solarStTotalCap,
    solarPowerGenTotalCap,
    solarPumpTotalCap,
    windTotalCap,
    hydroTotalCap,
    biomassTotalCap,
    solarPowerGenTotalAEP,
    solarStCapSeries,
    powerGenCapSeries,
    pumpCapSeries,
    windCapSeries,
    hydroCapSeries,
    biomassCapSeries,
    powerGenAEPSeries,
    countSeries,
    totalCapacitySeries,
    realTotalCapacity,
    totalUnits,
    co2SavedKg,
    coalSavedKg,
    treesEquivalent,
    uptimeRate,
    totalSystems,
    operationalSystems,
  } = groupAggregates(filteredInventories);

  let chartComponent = null;
  if (selectedChart === "solarSt") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: solarStCapSeries ?? [], label: 'Solar Streetlights/Lights (kWp)', color: theme.palette.warning.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "powerGen") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: powerGenCapSeries ?? [], label: 'Solar Power Generation (kWp)', color: theme.palette.primary.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "pump") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: pumpCapSeries ?? [], label: 'Solar Pump (kWp)', color: theme.palette.info.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "wind") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: windCapSeries ?? [], label: 'Wind Energy (kWp)', color: theme.palette.info.dark }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "hydro") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: hydroCapSeries ?? [], label: 'Hydropower (kWp)', color: theme.palette.primary.light }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "biomass") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: biomassCapSeries ?? [], label: 'Biomass (kWp)', color: theme.palette.success.dark }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "powerGenAEP") {
    chartComponent = (
      <LineChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'point', label: 'Month' }]}
        series={[{ data: powerGenAEPSeries ?? [], label: 'Annual Energy Production (kWh)', color: theme.palette.success.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "count") {
    chartComponent = (
      <LineChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'point', label: 'Month' }]}
        series={[{ data: countSeries ?? [], label: 'Inventories Added', color: theme.palette.error.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "totalCap") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: totalCapacitySeries ?? [], label: "Total Capacity (kWp)", color: theme.palette.secondary.main }]}
        height={500}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
          borderRadius: 4, 
          py: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.3)"
        }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else {
    // Default chart when no specific chart is selected
    chartComponent = (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 500,
        textAlign: 'center',
        p: 4
      }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          📊 Welcome to Charts & Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Select a chart type from the dropdown above to view detailed analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Available options include Total Capacity Overview, Solar Energy charts, Wind Energy, Hydropower, and more
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {chartOptions.slice(0, 6).map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              icon={<span>{option.icon}</span>}
              variant="outlined"
              color="primary"
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  const chartSubtitle = getChartSubtitle({
    selectedChart,
    solarStTotalCap,
    solarPowerGenTotalCap,
    solarPumpTotalCap,
    windTotalCap,
    hydroTotalCap,
    biomassTotalCap,
    solarPowerGenTotalAEP,
    realTotalCapacity,
  });

  const cardFadeProps = {
    timeout: 800,
    in: true,
    appear: true,
  };

  const noData = selectedChart && filteredInventories.length === 0;
  const needUploaderSelection = isAdminOrManager && uploaderFilter.length === 0;
  const isLoading = false; // You can add actual loading state logic here
  
  // Show no data message only when a specific chart is selected and there's no data
  const shouldShowNoData = selectedChart && selectedChart !== "totalCap" && filteredInventories.length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%)",
        position: "relative"
      }}>
        {/* Compact Header */}
        <Paper elevation={2} sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{
              fontWeight: 600,
              color: theme.palette.grey[700],
              fontSize: 20,
              mb: 0
            }}>
              📈 Charts and Statistics
            </Typography>
            {selectedChart && (
              <Chip 
                label={chartOptions.find(opt => opt.value === selectedChart)?.label || 'Chart Selected'} 
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
            <IconButton
              onClick={handleOpenHelpModal}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            size="small"
            >
              <HelpIcon />
            </IconButton>
        </Paper>

        <Paper elevation={4}
              sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            flex: 1
          }}>

          {/* Show chart first, then filters below */}
          {needUploaderSelection ? (
            <Alert severity="info" sx={{ 
              mb: 3, 
              fontWeight: 600, 
              fontSize: 16,
              borderRadius: 3,
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              📋 Please expand filters below and select at least one uploader to begin.
                </Alert>
              ) : (
            <>
              {/* Chart Section - Show Immediately */}
              {selectedChart && (
                <>
                  <Typography align="center" sx={{ 
                    mb: 2, 
                    fontWeight: 700, 
                    color: theme.palette.grey[800], 
                    fontSize: 18,
                    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    {chartSubtitle}
                  </Typography>
                  
                  {/* Enhanced Chart Container */}
                  <Box
                    sx={{
                      height: { xs: 350, md: 450 },
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      borderRadius: 3,
                      p: { xs: 1, md: 2 },
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                      position: "relative",
                      overflow: "hidden",
                      mb: 3,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
                        borderRadius: "3px 3px 0 0"
                      }
                    }}>
                    {isLoading ? (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                      }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                          📊 Loading chart data...
                        </Typography>
                      </Box>
                    ) : shouldShowNoData ? (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        textAlign: "center",
                        p: 3
                      }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          📊 No Data Available
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                          No data found for the selected chart and filters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your filters below
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {chartComponent}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </>
          )}

          {/* Collapsible Filters */}
          <MultiFilter
            chartOptions={chartOptions}
            selectedChart={selectedChart}
            setSelectedChart={setSelectedChart}
            showOtherFilters={!!selectedChart && (isAdminOrManager ? (uploaderFilter.length === 0 || uploaderFilter.includes("all") ? true : uploaderFilter.length > 0) : true)}
            regionOptions={regionOptions}
            regionValue={regionValue}
            setRegionValue={setRegionValue}
            yearOptions={yearOptions}
            yearValue={yearValue}
            setYearValue={setYearValue}
            selectedReClass={selectedReClass}
            setSelectedReClass={setSelectedReClass}
            reClassOptionsFiltered={reClassOptionsFiltered}
            selectedReCat={selectedReCat}
            setSelectedReCat={setSelectedReCat}
            reCatOptionsFiltered={reCatOptionsFiltered}
            uploaderOptions={uploaderOptions}
            uploaderFilter={uploaderFilter}
            setUploaderFilter={setUploaderFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isAdminOrManager={isAdminOrManager}
            username={username}
            usersByAffiliation={usersByAffiliation}
            availableAffiliations={availableAffiliations}
            installersGroup={installersGroup}
          />

          {/* Quick Reset Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedChart("totalCap");
                setRegionValue("");
                setYearValue("");
                setSelectedReClass("all");
                setSelectedReCat("all");
                setUploaderFilter(isAdminOrManager ? [] : ["all"]);
                setStatusFilter(["Operational", "For Repair", "Condemable"]);
              }}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5,
                borderColor: theme.palette.grey[400],
                color: theme.palette.grey[700],
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              🔄 Reset Filters
            </Button>
          </Box>

          {/* Compact Metrics Section */}
          {selectedChart && !needUploaderSelection && !shouldShowNoData && (
            <>
                  <Divider sx={{ 
                my: 3, 
                height: 1,
                    background: "linear-gradient(90deg, #e2e8f0, #cbd5e1, #e2e8f0)",
                    borderRadius: 1
                  }} />
                  
              <Typography variant="h6" align="center" sx={{ 
                mb: 3, 
                    fontWeight: 600, 
                    color: theme.palette.grey[700],
                fontSize: 18
                  }}>
                📊 Key Metrics
                  </Typography>
                  
              <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                {metricCards.slice(0, 4).map((card, i) => (
                  <Grid item xs={6} sm={3} key={card.label}>
                    <Fade {...cardFadeProps} style={{ transitionDelay: `${i * 80}ms` }}>
                          <Tooltip title={card.tooltip} placement="top" arrow>
                            <Card
                          elevation={3}
                              sx={{
                            minHeight: 120,
                            borderRadius: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            transition: "all 0.2s ease",
                                "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)"
                                }
                              }}
                            >
                              <CardContent sx={{ 
                                width: "100%", 
                                textAlign: "center", 
                            p: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                height: "100%"
                              }}>
                                <Box sx={{ 
                                  display: "flex", 
                                  justifyContent: "center", 
                              mb: 1,
                              color: theme.palette.primary.main,
                              '& svg': { fontSize: '2rem' }
                                }}>
                                  {card.icon}
                                </Box>
                            <Typography variant="caption" sx={{ 
                                  fontWeight: 600, 
                                  color: theme.palette.grey[700], 
                              fontSize: 11,
                              mb: 1,
                              lineHeight: 1.2
                                }}>
                                  {card.label}
                                </Typography>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                              fontSize: "1.1rem"
                                }}>
                                  {card.key === "uptimeRate"
                                    ? (card.renderValue
                                        ? card.renderValue(uptimeRate, { operationalSystems, totalSystems })
                                        : `${uptimeRate.toFixed(1)}%`)
                                    : numberFormat(
                                        card.key === "realTotalCapacity" ? realTotalCapacity :
                                        card.key === "totalUnits" ? totalUnits :
                                        card.key === "coalSavedKg" ? coalSavedKg :
                                        card.key === "co2SavedKg" ? co2SavedKg :
                                        card.key === "treesEquivalent" ? treesEquivalent :
                                        card.key === "uptimeRate" ? uptimeRate : 0,
                                        card.unit
                                      )
                                  }
                                </Typography>
                              </CardContent>
                            </Card>
                          </Tooltip>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
            </>
          )}
        </Paper>
      </Box>
      
      {/* Chart Help Modal */}
      <ChartHelpModal 
        open={openHelpModal} 
        onClose={handleCloseHelpModal} 
      />
    </Container>
  );
};

export default Charts;
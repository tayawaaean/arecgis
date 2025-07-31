import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllInventories } from "../inventories/inventoriesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import {
  Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  Container, useTheme, Divider, Grid, Card, CardContent, Tooltip, Fade,
  OutlinedInput, Checkbox, ListItemText, Alert,
} from "@mui/material";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarChart, LineChart } from '@mui/x-charts';
import useAuth from "../../hooks/useAuth";

const CO2_PER_KWH = 0.82;
const COAL_PER_KWH = 0.4;
const CO2_ABSORBED_PER_TREE_PER_YEAR = 21;

const chartOptions = [
  { value: "solarSt", label: "Solar Streetlights/Lights Installed per Month (kWp)" },
  { value: "powerGen", label: "Power Generation Capacity per Month (kWp)" },
  { value: "pump", label: "Solar Pumps Installed per Month (kWp)" },
  { value: "powerGenAEP", label: "Annual Energy Production for Power Generation per Month (kWh)" },
  { value: "count", label: "Inventories Added per Month" },
  { value: "totalCap", label: "Total Capacity Installed per Month (kWp)" },
];

const reClassOptions = [
  { value: "all", label: "All (Commercial & Non-Commercial)" },
  { value: "Commercial", label: "Commercial Only" },
  { value: "Non-Commercial", label: "Non-Commercial Only" }
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

    if (inv.assessment?.solarStreetLights) {
      const rawSolarItems = inv.assessment.solarStreetLights;
      const totalPcs = rawSolarItems.reduce((sum, item) => sum + (Number(item.pcs) || 0), 0);
      const totalCap = rawSolarItems.reduce(
        (sum, item) => sum + (Number(item.capacity) * Number(item.pcs)), 0
      );
      solarStTotalCap += totalCap;
      perMonth[monthKey] = perMonth[monthKey] || { solarSt: { cap: 0, count: 0 }, powerGen: { cap: 0, aep: 0, count: 0 }, pump: { cap: 0, count: 0 } };
      perMonth[monthKey].solarSt.cap += totalCap;
      perMonth[monthKey].solarSt.count += totalPcs;
      realTotalCapacity += totalCap;
      unitsThisInv += totalPcs;
    }

    const cap = Number(inv.assessment?.capacity) || 0;
    if (inv.assessment?.solarUsage === "Power Generation") {
      solarPowerGenTotalCap += cap;
      perMonth[monthKey] = perMonth[monthKey] || { solarSt: { cap: 0, count: 0 }, powerGen: { cap: 0, aep: 0, count: 0 }, pump: { cap: 0, count: 0 } };
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
      perMonth[monthKey] = perMonth[monthKey] || { solarSt: { cap: 0, count: 0 }, powerGen: { cap: 0, aep: 0, count: 0 }, pump: { cap: 0, count: 0 } };
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

    totalUnits += unitsThisInv;

    inventoryAddedPerMonth[monthKey] = (inventoryAddedPerMonth[monthKey] || 0) + 1;
    totalCapacityPerMonth[monthKey] = (totalCapacityPerMonth[monthKey] || 0) + cap;
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
    solarPowerGenTotalAEP,
    solarStCapSeries,
    powerGenCapSeries,
    pumpCapSeries,
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
  solarPowerGenTotalAEP,
  realTotalCapacity,
}) => {
  switch (selectedChart) {
    case "solarSt":      return `Total: ${numberFormat(solarStTotalCap, "MW")}`;
    case "powerGen":     return `Total: ${numberFormat(solarPowerGenTotalCap, "MW")}`;
    case "pump":         return `Total: ${numberFormat(solarPumpTotalCap, "MW")}`;
    case "powerGenAEP":  return `Total Declared Annual Energy Prod. (Power Gen): ${numberFormat(solarPowerGenTotalAEP, "kWh")}`;
    case "count":        return `Grand Total Capacity: ${numberFormat(solarStTotalCap + solarPowerGenTotalCap + solarPumpTotalCap, "MW")}`;
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
    tooltip: "Total installed solar capacity (all types, MW)."
  },
  {
    label: "Total Units Installed",
    icon: <ScatterPlotIcon fontSize="large" color="info" />,
    key: "totalUnits",
    unit: "",
    tooltip: "Total number of solar units (all types)."
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
  uploaderOptions, uploaderFilter, setUploaderFilter,
  statusFilter, setStatusFilter,
  isAdminOrManager, username
}) {
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {/* Uploader selector: only for admin/manager */}
      {isAdminOrManager && (
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel id="uploader-selector-label">Uploader</InputLabel>
          <Select
            labelId="uploader-selector-label"
            multiple
            value={uploaderFilter}
            onChange={e => {
              const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
              if (value.includes("all")) {
                setUploaderFilter(["all"]);
              } else {
                setUploaderFilter(value.filter(v => v !== "all"));
              }
            }}
            input={<OutlinedInput label="Uploader" />}
            renderValue={selected =>
              selected.includes("all")
                ? "All"
                : selected.join(', ')
            }
          >
            <MenuItem value="all">
              <Checkbox checked={uploaderFilter.includes("all")} />
              <ListItemText primary="All" />
            </MenuItem>
            {uploaderOptions.map((name, idx) => (
              <MenuItem key={idx} value={name}>
                <Checkbox checked={uploaderFilter.includes("all") || uploaderFilter.includes(name)} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      )}
      {/* Chart selector: always visible */}
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth disabled={isAdminOrManager ? (uploaderFilter.length === 0) : false}>
          <InputLabel id="chart-selector-label">Chart</InputLabel>
          <Select
            labelId="chart-selector-label"
            value={selectedChart}
            onChange={e => setSelectedChart(e.target.value)}
            input={<OutlinedInput label="Chart" />}
          >
            {chartOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {showOtherFilters && selectedChart && (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="region-selector-label">Region</InputLabel>
              <Select
                labelId="region-selector-label"
                value={regionValue}
                onChange={e => setRegionValue(e.target.value)}
                input={<OutlinedInput label="Region" />}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {regionOptions.length === 0
                  ? <MenuItem value="" disabled>No data</MenuItem>
                  : regionOptions.map(region => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="year-selector-label">Year</InputLabel>
              <Select
                labelId="year-selector-label"
                value={yearValue}
                onChange={e => setYearValue(e.target.value)}
                input={<OutlinedInput label="Year" />}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {yearOptions.length === 0
                  ? <MenuItem value="" disabled>No data</MenuItem>
                  : yearOptions.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="reclass-selector-label">RE Class</InputLabel>
              <Select
                labelId="reclass-selector-label"
                value={selectedReClass}
                onChange={e => setSelectedReClass(e.target.value)}
                input={<OutlinedInput label="RE Class" />}
              >
                {reClassOptionsFiltered.length === 0
                  ? <MenuItem value="" disabled>No data</MenuItem>
                  : reClassOptionsFiltered.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Status filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-selector-label">Status</InputLabel>
              <Select
                labelId="status-selector-label"
                multiple
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                }
                input={<OutlinedInput label="Status" />}
                renderValue={selected => selected.join(', ')}
              >
                {statusOptions.map((name, idx) => (
                  <MenuItem key={idx} value={name}>
                    <Checkbox checked={statusFilter.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
    </Grid>
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

  // Uploader options with "all" at the top
  const uploaderOptions = isAdminOrManager
    ? Array.from(new Set(inventories.map(inv => inv.username).filter(Boolean)))
    : [];

  // Default: "all" is not selected, require explicit selection
  const [uploaderFilter, setUploaderFilter] = useState([]);
  const [selectedChart, setSelectedChart] = useState("totalCap");
  const [regionValue, setRegionValue] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [selectedReClass, setSelectedReClass] = useState("all");
  const [statusFilter, setStatusFilter] = useState(["Operational", "For Repair", "Condemable"]);

  let inventoriesForFilter = inventories.filter(inv => {
    if (
      isAdminOrManager &&
      uploaderFilter.length > 0 &&
      !uploaderFilter.includes("all") &&
      !uploaderFilter.includes(inv.username)
    ) return false;
    if (!selectedChart) return true;
    if (selectedReClass !== "all" && inv?.properties?.reClass !== selectedReClass) return false;
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

  const filteredInventories = inventories.filter(inv => {
    if (
      isAdminOrManager &&
      uploaderFilter.length > 0 &&
      !uploaderFilter.includes("all") &&
      !uploaderFilter.includes(inv.username)
    ) return false;
    if (!selectedChart) return false;
    if (selectedReClass !== "all" && inv?.properties?.reClass !== selectedReClass) return false;
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
    solarPowerGenTotalAEP,
    solarStCapSeries,
    powerGenCapSeries,
    pumpCapSeries,
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
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "powerGen") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: powerGenCapSeries ?? [], label: 'Power Generation (kWp)', color: theme.palette.primary.main }]}
        height={500}
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "pump") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: pumpCapSeries ?? [], label: 'Solar Pump (kWp)', color: theme.palette.info.main }]}
        height={500}
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "powerGenAEP") {
    chartComponent = (
      <LineChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'point', label: 'Month' }]}
        series={[{ data: powerGenAEPSeries ?? [], label: 'Annual Energy Production (kWh)', color: theme.palette.success.main }]}
        height={500}
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "count") {
    chartComponent = (
      <LineChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'point', label: 'Month' }]}
        series={[{ data: countSeries ?? [], label: 'Inventories Added', color: theme.palette.error.main }]}
        height={500}
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  } else if (selectedChart === "totalCap") {
    chartComponent = (
      <BarChart
        xAxis={[{ id: 'months', data: xLabels ?? [], scaleType: 'band', label: 'Month' }]}
        series={[{ data: totalCapacitySeries ?? [], label: "Total Capacity (kWp)", color: theme.palette.secondary.main }]}
        height={500}
        sx={{ background: "#f5f7fb", borderRadius: 3, py: 2 }}
        margin={{ left: 70, right: 40, top: 40, bottom: 60 }}
      />
    );
  }

  const chartSubtitle = getChartSubtitle({
    selectedChart,
    solarStTotalCap,
    solarPowerGenTotalCap,
    solarPumpTotalCap,
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

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
        py: { xs: 2, md: 6 }
      }}>
        <Paper elevation={6}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            width: "100%",
            maxWidth: 1320,
            borderRadius: 5,
            background: "linear-gradient(120deg,#fff 75%,#e8f0fe 120%)",
            boxShadow: 10,
            mb: 4,
          }}>
          <Typography variant="h3" align="center" gutterBottom sx={{
            fontWeight: 900,
            letterSpacing: 1,
            color: theme.palette.primary.dark,
            pb: 2,
            fontSize: { xs: 32, md: 50 }
          }}>
            Charts and Statistics
          </Typography>
          <Divider sx={{ my: 2, mb: 3 }} />

          {/* MultiFilter controls at the top */}
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
            uploaderOptions={uploaderOptions}
            uploaderFilter={uploaderFilter}
            setUploaderFilter={setUploaderFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isAdminOrManager={isAdminOrManager}
            username={username}
          />

          {needUploaderSelection ? (
            <Alert severity="info" sx={{ mb: 3, fontWeight: 600, fontSize: 18 }}>
              Please select at least one uploader to begin.
            </Alert>
          ) : selectedChart && (
            <>
              {noData ? (
                <Alert severity="info" sx={{ mb: 3, fontWeight: 600, fontSize: 18 }}>
                  No data available for the selected filters.
                </Alert>
              ) : (
                <>
                  <Typography align="center" sx={{ mb: 2, fontWeight: 700, color: theme.palette.grey[800], fontSize: 20 }}>
                    {chartSubtitle}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      minHeight: { xs: 320, md: 550 },
                      background: "#f5f7fb",
                      borderRadius: 3,
                      p: { xs: 1, md: 3 }
                    }}>
                    {chartComponent}
                  </Box>
                  <Divider sx={{ my: 4 }} />
                  <Grid container spacing={2} justifyContent="center" alignItems="stretch" sx={{ mb: 1 }}>
                    {metricCards.map((card, i) => (
                      <Grid item xs={12} sm={6} md={4} key={card.label}>
                        <Fade {...cardFadeProps} style={{ transitionDelay: `${i * 110}ms` }}>
                          <Tooltip title={card.tooltip} placement="top" arrow>
                            <Card
                              elevation={4}
                              sx={{
                                minHeight: 145,
                                borderRadius: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                background: "#fff",
                                boxShadow: `0 4px 32px 0 ${theme.palette.grey[200]}`,
                                border: `2px solid ${theme.palette.grey[100]}`,
                                transition: "transform 0.15s cubic-bezier(.4,2,.2,1)",
                                "&:hover": {
                                  transform: "scale(1.045)",
                                  borderColor: theme.palette.primary.light
                                }
                              }}
                            >
                              <CardContent sx={{ width: "100%", textAlign: "center", pb: "10px!important" }}>
                                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>{card.icon}</Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.grey[600], fontSize: 16 }}>
                                  {card.label}
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.primary.main, mt: 1 }}>
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
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Charts;
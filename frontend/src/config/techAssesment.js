export const Status = [{
    id: 0,
    name: "Operational",
    checked: false,
},
{
    id: 1,
    name: "For Repair",
    checked: false,
},
{
    id: 2,
    name: "Condemnable",
    checked: false,
},
]

export const Classification = [
    {
        id: 1,
        name: "Non-Commercial",
        checked: false,
    },
    {
        id: 2,
        name: "Commercial",
        checked: false,
    },
    {
        id: 3,
        name: "Generating Company",
        checked: false,
    },
    {
        id: 4,
        name: "Other",
        value: "",
        checked: false,
    }
]

export const mannerOfAcquisition = [{
    id: 0,
    name: "Awarded/Donation",
    checked: false,
},
{
    id: 1,
    name: "Self-Established",
    checked: false,
},
]

export const rawSolarUsage = [{
    id: 0,
    name: "Solar Street Lights",
    checked: false,
},
{
    id: 1,
    name: "Solar Pump",
    checked: false,
},
{
    id: 2,
    name: "Power Generation",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked: false,
},
]

export const rawSolarPumpSubcategories = [{
    id: 0,
    name: "Solar Pump Irrigation System",
    checked: false,
},
{
    id: 1,
    name: "Community Water System",
    checked: false,
},
{
    id: 2,
    name: "Livestock Water System",
    checked: false,
}]

export const rawSolarPowerGenSubcategories = [{
    id: 0,
    name: "Rooftop Solar PV",
    checked: false,
    subcategories: [
        {
            id: 0,
            name: "Residential rooftop – installed on homes",
            checked: false,
        },
        {
            id: 1,
            name: "Commercial rooftop – malls, offices, warehouses",
            checked: false,
        },
        {
            id: 2,
            name: "Industrial rooftop – factories, plants",
            checked: false,
        }
    ]
},
{
    id: 1,
    name: "Ground-mounted Solar PV",
    checked: false,
    subcategories: [
        {
            id: 0,
            name: "Solar farms / Solar parks – utility-scale, large open land",
            checked: false,
        }
    ]
},
{
    id: 2,
    name: "Floating Solar PV",
    checked: false,
    subcategories: [
        {
            id: 0,
            name: "Floating solar farms – installed on reservoirs, lakes, or dams",
            checked: false,
        }
    ]
},
{
    id: 3,
    name: "Building-integrated PV (BIPV)",
    checked: false,
    subcategories: [
        {
            id: 0,
            name: "Integrated into walls, windows, facades, or roofing materials",
            checked: false,
        }
    ]
}]

export const rawSolarSysTypes = [{
    id: 0,
    name: "Off-grid",
    checked: false,
},
{
    id: 1,
    name: "Grid-tied",
    checked: false,
},
{
    id: 2,
    name: "Hybrid",
    checked: false,
},
]

export const rawModuleTypes = [{
    id: 1,
    name: "Monocrystalline",
    checked: false,
},
{
    id: 2,
    name: "Polycrystalline",
    checked: false,
},
{
    id: 3,
    name: "Thin-film",
    checked: false,
},
{
    id: 4,
    name: "Other",
    value: "",
    checked: false,
},
]

export const rawBatteryTypes = [{
    id: 1,
    name: "Lead-Acid",
    checked: false,
},
{
    id: 2,
    name: "Lithium-Ion",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked: false,
},
]
export const rawMountingLoc = [{
    id: 1,
    name: "Roof Mounted",
    checked: false,
},
{
    id: 2,
    name: "Ground Mounted",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked: false,
},
]

export const rawSolarPanelStatus = [{
    id: 0,
    name: "Operational",
    checked:false
},
{
    id: 1,
    name: "For Repair",
    checked:false
},
{
    id: 2,
    name: "For Condemn",
    checked:false
},
{
    id: 3,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawChargeControllerStatus = [{
    id: 0,
    name: "Operational",
    checked:false
},
{
    id: 1,
    name: "For Repair",
    checked:false
},
{
    id: 2,
    name: "For Condemn",
    checked:false
},
{
    id: 3,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawBatteryStatus = [{
    id: 0,
    name: "Operational",
    checked:false
},
{
    id: 1,
    name: "For Repair",
    checked:false
},
{
    id: 2,
    name: "For Condemn",
    checked:false
},
{
    id: 3,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawWiringsStatus = [{
    id: 0,
    name: "Operational",
    checked:false
},
{
    id: 1,
    name: "For Repair",
    checked:false
},
{
    id: 2,
    name: "For Condemn",
    checked:false
},
{
    id: 3,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawWindUsage = [{
    id: 0,
    name: "Water pump",
    checked: false,
},
{
    id: 1,
    name: "Power Generation",
    checked: false,
},
{
    id: 2,
    name: "Other",
    checked: false,
},
]

export const rawWindSysTypes = [{
    id: 1,
    name: "Off-grid",
    checked: false,
},
{
    id: 2,
    name: "Stand-alone",
    checked: false,
},
{
    id: 3,
    name: "Hybrid",
    checked: false,
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]


export const rawWindTurbineTypes = [{
    id: 1,
    name: "Horizontal Axis",
    checked: false,
},
{
    id: 2,
    name: "Vertical Axis",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawWindTowerTypes = [{
    id: 1,
    name: "Self-Supporting",
    checked: false,
},
{
    id: 2,
    name: "Guyed",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawWindSystemStatus = [{
    id: 1,
    name: "Operational",
    checked:false
},
{
    id: 2,
    name: "For Repair",
    checked:false
},
{
    id: 3,
    name: "For Condemn",
    checked:false
},
{
    id: 4,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 5,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawBiomassDigester = [{
    id: 1,
    name: "Fixed Dome",
    checked: false,
},
{
    id: 2,
    name: "Floating Gas Holder",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked:false
},
]
export const rawBiomassLoc = [{
    id: 1,
    name: "Above",
    checked: false,
},
{
    id: 2,
    name: "Underground",
    checked: false,
},
{
    id: 3,
    name: "Other",
    value: "",
    checked:false
},
]
export const rawBiomassPriUsage = [{
    id: 0,
    name: "Biogas",
    checked: false,
},
{
    id: 1,
    name: "Gasification",
    checked: false,
},
{
    id: 2,
    name: "Torrefaction",
    checked: false,
},
{
    id: 3,
    name: "Pyrolysis",
    checked: false,
},
{
    id: 4,
    name: "Other",
    value: "",
    checked:false
},
]

export const rawBioUsage = [{
    id: 0,
    name: "Cooking",
    checked: false,
},
{
    id: 1,
    name: "Power Generation",
    checked: false,
},
]

export const rawBiomassSystemStatus = [{
    id: 1,
    name: "Operational",
    checked:false
},
{
    id: 2,
    name: "For Repair",
    checked:false
},
{
    id: 3,
    name: "For Condemn",
    checked:false
},
{
    id: 4,
    name: "Nowhere to be found",
    checked:false
},
{
    id: 5,
    name: "Other",
    value: "",
    checked:false
},
]


export const rawGeothermalUsage = [{
    id: 0,
    name: "Power Generation",
    checked: false,
}]

export const rawHydroUsage = [{
    id: 0,
    name: "Power Generation",
    checked: false,
}]

export const pages = [
    {
        id: 0,
        title: 'Map Dashboard',
        href: "/public/mapdashboard",
    },
    {
        id: 1,
        title: 'About',
        href: "/public/about",
    },
    {
        id: 2,
        title: 'Home',
        href: "/",
    },

]
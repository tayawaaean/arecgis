import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import PublicMapDashboard from './components/PublicMapDashboard'
import PublicBlogDashboard from './components/PublicBlogDashboard'
import REsources from './components/resources/REsources'
import About from './features/misc/About'

import PublicFetch from './config/PublicFetch'


import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import AccountSettings from './features/users/AccountSettings'

import RenergiesMap from './features/renergies/RenergiesMap'
import RenergiesList from './features/renergies/RenergiesList'
import EditRenergy from './features/renergies/EditRenergy'
import NewRenergy from './features/renergies/NewRenergy'

import InventoryMap from './features/inventories/InventoryMap'
import InventoriesList from './features/inventories/InventoriesList'
import EditInventory from './features/inventories/EditInventory'
import NewInventory from './features/inventories/NewInventory'

import Charts from './features/charts/Chart';

import Transactions from './features/transfers/Transactions';
import TransferDetail from './features/transfers/TransferDetail';
import TransferForm from './features/transfers/TransferForm';
import NewTransfer from './features/transfers/NewTransfer';

import BlogMap from './features/blogs/BlogMap'
import BlogsList from './features/blogs/BlogsList'
import EditBlog from './features/blogs/EditBlog'
import NewBlog from './features/blogs/NewBlog'

import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import useTitle from './hooks/useTitle';
import PublicDashLayout from './components/PublicDashLayout'





let theme = createTheme({
  palette: {
    primary: {
      main: '#000066',
      secondary: '#7ba6b7',
      yellow: '#FFBF00',
      ocean: '#CBCBD4',
      error: '#e23046',
      grey: '#dee7e6',
      dark: '#1d2830',
    },
  white: {
    main: '#FFF'
  },
  custom: {
    main: '#000066',
    secondary: '#7ba6b7',
    error: '#e23046',
    grey: '#dee7e6',
    dark: '#1d2830',
  }
  },
  typography: {
    allVariants: {
      fontFamily:'Poppins',
      textTransform: 'none',
    },
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      "'Segoe UI'",
      'Roboto',
      "'Helvetica Neue'",
      'Arial',
      'sans-serif',
      "'Apple Color Emoji'",
      "'Segoe UI Emoji'",
      "'Segoe UI Symbol'",
    ].join(','),
  },
})

theme = responsiveFontSizes(theme)

function App() {
  useTitle('Affiliated Renewable Energy Center - MMSU')
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* public routes */}
          <Route index element={<Public />} />
          <Route path='login' element={<Login />} />
            <Route element={<PublicFetch />}>
            <Route path='public' element={<PublicDashLayout />}>
              <Route path='mapdashboard' element={<PublicMapDashboard />} />
              <Route path='about' element={<About/>} />
              <Route path='blogdashboard' element={<PublicBlogDashboard />} />
              <Route path='resources' element={<REsources />} />
            </Route>
            </Route>
          
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
              <Route element={<Prefetch />}>
                <Route path='dashboard' element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  
                  <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                    <Route path='users'>
                      <Route index element={<UsersList />} />
                      <Route path=':id' element={<EditUser />} />
                      <Route path='new' element={<NewUserForm />} />
                    </Route>
                  </Route>
                  <Route path='about' element={<About/>} />
                      <Route path='settings'>
                          <Route path=':id' element={<AccountSettings />} />

                      </Route>

                  <Route path='inventories'>
                    <Route index element={<InventoryMap />} />
                    <Route path='list' element={<InventoriesList />} />
                    <Route path=':id' element={<EditInventory />} />
                    <Route path='new' element={<NewInventory />} />
                  </Route>

                  <Route path='renergies'>
                    <Route index element={<RenergiesMap />} />
                    <Route path='list' element={<RenergiesList />} />
                    <Route path=':id' element={<EditRenergy />} />
                    <Route path='new' element={<NewRenergy />} />
                  </Route>

                  <Route path='charts' element={<Charts />} />

                  <Route path="/dashboard/transfers/new" element={<NewTransfer />} />
                  <Route path="transfers">
                    <Route index element={<Transactions />} />
                    <Route path=":id" element={<TransferDetail />} />
                    <Route path="new" element={<TransferForm />} />
                  </Route>

                  <Route path='blogs'>
                    <Route index element={<BlogMap />} />
                    <Route path='list' element={<BlogsList />} />
                    <Route path=':id' element={<EditBlog />} />
                    <Route path='new' element={<NewBlog />} />
                  </Route>

                </Route>{/* End Dash */}
              </Route>
            </Route>
          </Route>{/*end protected routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App

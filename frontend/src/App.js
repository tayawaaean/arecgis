import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import PublicDashLayout from './components/PublicDashLayout'
import PublicFetch from './config/PublicFetch'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';
import GlobalLoading from './components/GlobalLoading'
import NotFound from './components/NotFound'
import Forbidden from './components/Forbidden'

const Public = lazy(() => import('./components/Public'))
const PublicMapDashboard = lazy(() => import('./components/PublicMapDashboard'))
const PublicBlogDashboard = lazy(() => import('./components/PublicBlogDashboard'))
const REsources = lazy(() => import('./components/resources/REsources'))
const About = lazy(() => import('./features/misc/About'))

const Login = lazy(() => import('./features/auth/Login'))
const DashLayout = lazy(() => import('./components/DashLayout'))
const Welcome = lazy(() => import('./features/auth/Welcome'))
const UsersList = lazy(() => import('./features/users/UsersList'))
const EditUser = lazy(() => import('./features/users/EditUser'))
const NewUserForm = lazy(() => import('./features/users/NewUserForm'))
const AccountSettings = lazy(() => import('./features/users/AccountSettings'))
const UserProfile = lazy(() => import('./features/users/UserProfile'))

const RenergiesMap = lazy(() => import('./features/renergies/RenergiesMap'))
const RenergiesList = lazy(() => import('./features/renergies/RenergiesList'))
const EditRenergy = lazy(() => import('./features/renergies/EditRenergy'))
const NewRenergy = lazy(() => import('./features/renergies/NewRenergy'))

const InventoryMap = lazy(() => import('./features/inventories/InventoryMap'))
const InventoriesList = lazy(() => import('./features/inventories/InventoriesList'))
const EditInventory = lazy(() => import('./features/inventories/EditInventory'))
const NewInventory = lazy(() => import('./features/inventories/NewInventory'))

const Charts = lazy(() => import('./features/charts/Chart'));

const RequestsList = lazy(() => import('./features/requests/RequestsList'))
const RequestDetail = lazy(() => import('./features/requests/RequestDetail'))
const RequestForm = lazy(() => import('./features/requests/RequestForm'))

const BlogMap = lazy(() => import('./features/blogs/BlogMap'))
const BlogsList = lazy(() => import('./features/blogs/BlogsList'))
const EditBlog = lazy(() => import('./features/blogs/EditBlog'))
const NewBlog = lazy(() => import('./features/blogs/NewBlog'))

const AffiliationsManagement = lazy(() => import('./features/affiliations/AffiliationsManagement'))





let theme = createTheme({
  palette: {
    primary: {
      main: '#000066',
      light: '#3c3c99',
      dark: '#000043',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#7ba6b7',
      light: '#a8c4cf',
      dark: '#4f7b8a',
      contrastText: '#0b1b22'
    },
    error: { main: '#e23046' },
    warning: { main: '#FFBF00' },
    info: { main: '#CBCBD4' },
    grey: { 100: '#dee7e6' }
  },
  typography: {
    allVariants: {
      fontFamily: 'Poppins',
      textTransform: 'none',
    },
    fontFamily: [
      'Poppins',
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
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<GlobalLoading message="Loading application…" /> }>
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
                      
                      <Route path='profile'>
                          <Route index element={<UserProfile />} />
                          <Route path=':id' element={<UserProfile />} />
                      </Route>
                      
                      <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                          <Route path='affiliations' element={<AffiliationsManagement />} />
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

                  <Route path="requests">
                    <Route index element={<RequestsList />} />
                    <Route path=":id" element={<RequestDetail />} />
                    <Route path="new" element={<RequestForm />} />
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
          <Route path='forbidden' element={<Forbidden />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

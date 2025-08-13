import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let isInstaller = false
    let status = "Employee"
    let userId = ''
    let roles = []

    if (token) {
        try {
            const decoded = jwtDecode(token)
            const { username, roles: userRoles, id } = decoded.UserInfo || {}
            roles = userRoles || []
            isManager = roles.includes('Manager')
            isAdmin = roles.includes('Admin')
            isInstaller = roles.includes('Installer')
            userId = id || ''

            if (isInstaller) status = "Installer"
            if (isManager) status = "Manager"
            if (isAdmin) status = "Admin"

            return { userId, username: username || '', roles, status, isManager, isAdmin, isInstaller }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.error('Failed to decode JWT', error)
            }
            // Return safe defaults when token is invalid/corrupt/expired
            return { userId, username: '', roles: [], isManager, isAdmin, isInstaller, status }
        }
    }

    return { userId, username: '', roles: [], isManager, isAdmin, isInstaller, status }
}

export default useAuth
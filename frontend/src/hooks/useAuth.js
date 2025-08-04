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
        const decoded = jwtDecode(token)
        const { username, roles: userRoles, id } = decoded.UserInfo
        
        roles = userRoles || []
        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')
        isInstaller = roles.includes('Installer')
        userId = id

        if (isInstaller) status = "Installer"
        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        console.log('Auth Debug:', { 
            userId, 
            username, 
            roles, 
            isInstaller, 
            isManager, 
            isAdmin, 
            status 
        })

        return { userId, username, roles, status, isManager, isAdmin, isInstaller }
    }

    return { userId, username: '', roles: [], isManager, isAdmin, isInstaller, status }
}

export default useAuth
// Simple role checker middleware
const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.status(403).json({ message: 'Forbidden' });

        const rolesArray = [...allowedRoles];
        
        // Check if req.roles is an array or object
        let authorized = false;
        
        if (Array.isArray(req.roles)) {
            // Check if any of the user's roles match any allowed roles
            authorized = rolesArray.some(role => req.roles.includes(role));
        } else if (typeof req.roles === 'object') {
            // Check if any of the user's roles (as object properties) match any allowed roles
            authorized = rolesArray.some(role => req.roles[role]);
        }
        
        if (!authorized) {
            return res.status(403).json({ message: 'Forbidden - Insufficient role permissions' });
        }
        
        next();
    }
}

module.exports = checkRoles;
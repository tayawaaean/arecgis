// Simple role checker middleware
const { baseLogger } = require('./logger')

const checkRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.status(403).json({ message: 'Forbidden - No roles found' });
        }

        const rolesArray = allowedRoles.flat();
        let authorized = false;

        if (Array.isArray(req.roles)) {
            authorized = rolesArray.some(allowedRole => req.roles.includes(allowedRole));
        } else if (typeof req.roles === 'object') {
            authorized = rolesArray.some(role => req.roles[role]);
        }

        if (!authorized) {
            baseLogger.warn({ requestId: req.id, user: req.user, roles: req.roles, required: rolesArray }, 'Access denied - insufficient permissions')
            return res.status(403).json({ message: 'Forbidden - Insufficient role permissions' });
        }

        next();
    }
}

module.exports = checkRoles;
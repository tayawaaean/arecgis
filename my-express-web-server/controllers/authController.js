const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { username, password, checkedTerms } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Username doesn\'t exist.' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'The password you\'ve entered is incorrect.' })
    if (checkedTerms===false) return res.status(401).json({ message: 'You must acknowledge that you have read and understood the Terms of Use, Conditions and Privacy Policy' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser.id,
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {  
            "id": foundUser.id,
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create cookie with refresh token (secure in production, dev-friendly locally)
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // accessible only by web server
        secure: isProduction, // https only in production
        sameSite: isProduction ? 'None' : 'Lax', // cross-site in prod; dev-friendly locally
        maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry: set to match rT
    })

    // Check if profile is complete
    const isProfileComplete = foundUser.isProfileComplete();
    const profileCompletionPercentage = foundUser.profileCompletionPercentage;

    // Send accessToken containing username and roles, plus profile completion status
    res.json({ 
        accessToken,
        isProfileComplete,
        profileCompletionPercentage,
        user: {
            id: foundUser.id,
            username: foundUser.username,
            roles: foundUser.roles,
            fullName: foundUser.fullName,
            email: foundUser.email,
            address: foundUser.address,
            contactNumber: foundUser.contactNumber
        }
    })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser.id,
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie('jwt', { httpOnly: true, sameSite: isProduction ? 'None' : 'Lax', secure: isProduction })
    res.json({ message: 'Cookie cleared' })
}

// @desc Verify user password
// @route POST /auth/verify
// @access Private - requires authentication
const verifyPassword = async (req, res) => {
    const { password } = req.body
    const username = req.user

    if (!password) {
        return res.status(400).json({ message: 'Password is required' })
    }

    try {
        // Find the user by username
        const foundUser = await User.findOne({ username }).exec()

        if (!foundUser || !foundUser.active) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Compare password with stored hash
        const match = await bcrypt.compare(password, foundUser.password)

        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' })
        }

        // Password is correct
        return res.status(200).json({ 
            success: true,
            message: 'Password verified successfully' 
        })
    } catch (err) {
        console.error('Error verifying password:', err)
        return res.status(500).json({ message: 'Server error during password verification' })
    }
}

module.exports = {
    login,
    refresh,
    logout,
    verifyPassword
}
import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: null,
        isProfileComplete: true,
        profileCompletionPercentage: 100,
        user: null
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, isProfileComplete, profileCompletionPercentage, user } = action.payload
            state.token = accessToken
            state.isProfileComplete = isProfileComplete !== undefined ? isProfileComplete : true
            state.profileCompletionPercentage = profileCompletionPercentage || 100
            state.user = user || null
        },
        logOut: (state, action) => {
            state.token = null
            state.isProfileComplete = true
            state.profileCompletionPercentage = 100
            state.user = null
        },
        updateProfileCompletion: (state, action) => {
            const { isProfileComplete, profileCompletionPercentage } = action.payload
            state.isProfileComplete = isProfileComplete
            state.profileCompletionPercentage = profileCompletionPercentage
        }
    }
})

export const { setCredentials, logOut, updateProfileCompletion } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectIsProfileComplete = (state) => state.auth.isProfileComplete
export const selectProfileCompletionPercentage = (state) => state.auth.profileCompletionPercentage
export const selectCurrentUser = (state) => state.auth.user
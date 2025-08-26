import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectIsProfileComplete } from '../features/auth/authSlice';
import ProfileCompletionModal from './ProfileCompletionModal';

const ProfileCompletionGuard = ({ children }) => {
    const isProfileComplete = useSelector(selectIsProfileComplete);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal if profile is incomplete and not on profile page
        if (!isProfileComplete && !location.pathname.includes('/profile')) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [isProfileComplete, location.pathname]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // If profile is not complete and we're not on profile page, show modal
    if (!isProfileComplete && !location.pathname.includes('/profile')) {
        return (
            <>
                {children}
                <ProfileCompletionModal 
                    open={showModal} 
                    onClose={handleCloseModal} 
                />
            </>
        );
    }

    return children;
};

export default ProfileCompletionGuard;

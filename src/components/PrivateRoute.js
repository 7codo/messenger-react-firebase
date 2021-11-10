import React from 'react'
import { useAuth } from '../contexts/auth'
import { Navigate } from 'react-router-dom'


const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return (
        currentUser ? children : <Navigate to="/login" />
    )
}

export default PrivateRoute;

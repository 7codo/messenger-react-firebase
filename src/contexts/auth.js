import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Loading from '../components/Loading'
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        });
        return () => unsubscribe()
    }, [])

    if (loading) return <Loading />
    return <AuthContext.Provider value={{ currentUser }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}


import React, { createContext, useContext, useState } from 'react';
import UserPool from './UserPool';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userToken, setUserToken] = useState(null);

    const login = (user) => {
        setIsAuthenticated(true);
        fetchUserAttributes(user);
        getUserToken(user);
    };

    const logout = () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
        setIsAuthenticated(false);
        setUserDetails(null);
        setUserRole(null);
        setUserToken(null);
        localStorage.removeItem('token');
    };

    const fetchUserAttributes = (user) => {
        if (user) {
            user.getUserAttributes((err, result) => {
                if (err) {
                    console.error('Error fetching user attributes:', err);
                    return;
                }
                const attributes = result.reduce((acc, attr) => {
                    acc[attr.Name] = attr.Value;
                    return acc;
                }, {});
                setUserDetails(attributes);
                setUserRole(attributes['custom:role'] || 'Consumer');
                if (attributes['sub']){
                    attributes['sub'] = attributes['sub'];
                }
            });
        }
    };

    const getUserToken = (user) => {
        if (user) {
            user.getSession((err, session) => {
                if (err) {
                    console.error('Error fetching user token:', err);
                    return;
                }
                setUserToken(session.getIdToken().getJwtToken());
            });
        }
    };

    return (
        console.log('AuthContext:', { isAuthenticated, userDetails, userRole, userToken }),
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            userDetails, 
            userRole, 
            userToken,  
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

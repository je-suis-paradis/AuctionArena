import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (token && username) {
            return { token, username, userId: parseInt(userId), isAdmin };
        }
        return null;
    });

    const loginUser = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        setUser(data);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
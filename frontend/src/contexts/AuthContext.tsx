import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // We need to handle navigation outside here or use window.location for logout redirect if not using router context
    // But AuthProvider is inside Router in App.tsx usually. Wait, usually AuthProvider wraps Router.
    // If AuthProvider wraps Router, we can't use useNavigate.
    // If Router wraps AuthProvider, we can.
    // In App.tsx: AppearanceProvider -> Router -> Routes.
    // So I should put AuthProvider inside Router.

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Fetch user profile to validate token and get role
                    const response = await fetch('http://localhost:3000/profile/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                    } else {
                        console.error('Token validation failed');
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    // Don't clear token immediately on network error, but maybe set user null?
                    // For safety, if we can't verify, we might keep user null or retry.
                    // Let's keep it simple: if error, treat as not logged in for now or handle gracefully.
                    // But strict security prefers clearing if invalid.
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optional: Redirect to login is handled by ProtectedRoute or component calling logout
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

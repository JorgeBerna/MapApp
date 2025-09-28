import React, {
    createContext, useEffect, useState
} from 'react';
import type { ReactNode } from 'react';
import { authService } from '../Services/AuthService';
import { Role } from '../Services/IAuthService';

interface AuthContextProps {
    user: any | null;
    roles: Role[] | null;
}

export const AuthContext =
    createContext<AuthContextProps>({
        user: null, roles:
            null
    });

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [roles, setRoles] = useState<Role[] | null>(null);
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (currentUser: any) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userRoles = await authService.getUserRoles(currentUser);
                    setRoles(userRoles);
                } catch (error) {
                    console.error('Error al obtener los roles:', error);
                    setRoles(null);
                }
            }
            else {
                setRoles(null);
            }
        });
        return unsubscribe;
    }, []);
    return (
        <AuthContext.Provider value={{ user, roles }}>
            {children}
        </AuthContext.Provider>
    );
};
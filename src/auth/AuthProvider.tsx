import { useContext, createContext, useState, useEffect, Children } from "react";


interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuntenticated: false,
});

export function AuthProvider({children}: AuthProviderProps) {
 
    const[isAuntenticated, setIsAuntenticated] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuntenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
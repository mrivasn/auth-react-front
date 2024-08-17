import { useContext, createContext, useState, useEffect, Children } from "react";
import { AccessTokenResponse, AuthResponse, User } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps{
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuntenticated: false,
    getAccessToken: () => {},
    getRefreshToken: () => {},
    saveUser: (userData: AuthResponse) => {},
    getUser: () => ({} as User | undefined),
});

export function AuthProvider({children}: AuthProviderProps) {
    const [isAuntenticated, setIsAuntenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<String>("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        checkAuth();
    }, []);


    async function checkAuth() {
        if (accessToken) {
            //usuario autenticado
        } else {
            const token = getRefreshToken();
            if (token){
                const newAccessToken = await requestNewAccessToken(token);
                if (newAccessToken){
                    const userInfo = await getUserInfo(newAccessToken);
                    if (userInfo){
                        saveSessionInfo(userInfo, newAccessToken, token);
                    }
                }
            }
        }
    }

    async function requestNewAccessToken(refreshToken:string) {
        try {
            const response = await fetch(`${API_URL}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${refreshToken}`,
                },
            });

            if (response.ok){
                const json = await response.json() as AccessTokenResponse;
                if (json.error){
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            } else {
                throw new Error(response.statusText);
                
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async function getUserInfo(accessToken:string) {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.ok){
                const json = await response.json();
                if (json.error){
                    throw new Error(json.error);
                }
                return json.body;
            } else {
                throw new Error(response.statusText);
                
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken(): string | null {
        const tokenData = localStorage.getItem("token");
        if (tokenData) {
            const token = JSON.parse(tokenData);
            return token;
        } 
        return null;
    }

    function saveUser(userData: AuthResponse){
        saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken);
    }

    function saveSessionInfo(userInfo:User, accessToken:String, refreshToken: String) {
        setAccessToken(accessToken);
        setUser(userInfo);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setIsAuntenticated(true);
    }

    function getUser(){
        return user;
    }

    return (
        <AuthContext.Provider value={{ isAuntenticated, getAccessToken, getRefreshToken, saveUser, getUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
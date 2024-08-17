import { useAuth } from "../auth/AuthProvider";
export default function Dashboard() {
    const auth = useAuth();
    return <h1>Dashboard de {auth.getUser()?.name || ":)"}</h1>    
}
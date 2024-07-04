import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import DefaultLayout from "../layout/DefaultLayout";

export default function Signup() {
    
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const auth = useAuth();

    if (auth.isAuntenticated){
        return <Navigate to="/dashboard"></Navigate>
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                })
            });

            if (response.ok) {
                console.log("User created successfully!");
            } else {
                console.log("Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuntenticated){
        return <Navigate to="/dashboard"/>;
    }


    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Signup</h1>
                
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

                <label>UserName</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button>Login</button>
            </form>
    </DefaultLayout>
    );
}
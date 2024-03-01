import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import "../../styles/login.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleClick = async () => {
        const success = await actions.login(email, password);
        if (success) {
            const user = await actions.getUser(email);
            if (user && user.id) {
                navigate(`/giftlist/${user.id}`);
            } else {
                console.error("No se pudo obtener el ID del usuario");
            }
        }
    };

    return (
        <div className="container text-center mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <h1>Login</h1>
                <p>¿Nuevo? <Link to="/signup">Registrate</Link></p>
                <input type="text" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="btn btn-primary mt-3" onClick={handleClick} >Submit</button>
            </div>
        </div>
    );
};


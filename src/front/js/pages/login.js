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
            const user = await actions.getUserToStore(email);
            if (user && user.id) {

                navigate(`/giftlist/${user.id}`);
            } else {
                console.error("No se pudo obtener el ID del usuario");
            }
        }
    };
    // TODO: POR REVISAR getAllList
    // const handleClick = async () => {
    //     try {
    //         const success = await actions.login(email, password);
    //         if (success) {
    //             console.log("Inicio de sesión exitoso");
    //             const user = await actions.getUser(email);
    //             if (user && user.id) {
    //                 console.log("Usuario obtenido:", user.id);
    //                 const newListSuccess = await actions.getAllList(user.id);
    //                 if (newListSuccess) {
    //                     console.log("Lista cargada exitosamente");
    //                     navigate(`/giftlist/${user.id}`);

    //                 } else {
    //                     console.error("Error al cargar la lista");
    //                 }
    //             } else {
    //                 console.error("No se pudo obtener el ID del usuario");
    //             }
    //         } else {
    //             console.error("Inicio de sesión fallido");

    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         // Manejar el error aquí
    //     }
    // };

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


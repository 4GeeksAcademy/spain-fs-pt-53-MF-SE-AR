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


    // const handleClick = async () => {
    //     const success = await actions.login(email, password);
    //     if (success) {
    //         const user = await actions.getUserToStore(email);
    //         if (user && user.id) {
    //             const uid = user.id
    //             navigate(`/user/${uid}/giftlist/1/allGifts`);
    //             // TODO:ADD lid AL URL, DE MOMENTO LO COLOCO MANUAL EN 1
    //         } else {
    //             console.error("No se pudo obtener el ID del usuario");
    //         }
    //     }
    // };
    // TODO: POR REVISAR getAllList
    const handleClick = async () => {
        try {
            const successLogin = await actions.login(email, password);
            if (!successLogin) return console.error("Error en el inicio de sesión");

            const user = await actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;
            console.log("Usuario obtenido:", uid);

            const newListSuccess = await actions.getAllList(uid);
            if (!newListSuccess || !newListSuccess[0]?.id) return console.error("Error al cargar la lista");

            const lid = newListSuccess[0].id;

            const newGiftSuccess = await actions.getGiftToStore(uid, lid);
            if (newGiftSuccess === null) {
                console.warn("No gift found");
            }

            const newGiftAvailableSuccess = await actions.getGiftToStoreAvailable(uid, lid);
            if (newGiftAvailableSuccess === null) {
                console.warn("No available gift found");
            }

            const newGiftPurchasedSuccess = await actions.getGiftToStorePurchased(uid, lid);
            if (newGiftPurchasedSuccess === null) {
                console.warn("No purchased gift found");
            }

            console.log("Regalo agregado exitosamente");
            console.log("Lista cargada exitosamente");
            navigate(`/user/${uid}/giftlist/${lid}/allGifts`);
        } catch (error) {
            console.error("Error:", error);
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
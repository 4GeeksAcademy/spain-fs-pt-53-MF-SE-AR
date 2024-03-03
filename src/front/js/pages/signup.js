import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import "../../styles/signup.css";

export const Signup = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [randomProfileImage, setRandomProfileImage] = useState("");

    useEffect(() => {
        if (store.profileImages.length === null) {
            store.actions.getProfilePhoto();
        } else {
            const randomIndex = Math.floor(Math.random() * store.profileImages.length);
            setRandomProfileImage(store.profileImages[randomIndex]);
        }
    }, [store.profileImages]);
    console.log(randomProfileImage)


    const handleSubmit = async () => {
        try {
            const successRegister = await actions.register(email, password, randomProfileImage);
            if (successRegister) {
                const successLogin = await actions.login(email, password);
                if (successLogin) {
                    console.log("Inicio de sesión exitoso");
                    const user = await actions.getUser(email);
                    if (user && user.id) {
                        console.log("Usuario obtenido:", user.id);
                        const newListSuccess = await actions.newList(user.id.toString());
                        if (newListSuccess) {
                            console.log("Lista creada exitosamente");
                            navigate(`/login`);
                        } else {
                            console.error("Error al crear la lista");
                            // Manejar el error aquí
                        }
                    } else {
                        console.error("No se pudo obtener el ID del usuario");
                    }
                } else {
                    console.error("Inicio de sesión fallido");
                    // Manejar el error aquí
                }
            }
        } catch (error) {
            console.error("Error:", error);
            // Manejar el error aquí
        }
    };

    return (
        <div className="container text-center mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <h1>Welcome, Signup form:</h1>
                <div className="image-container m-3">
                    {randomProfileImage && <img src={randomProfileImage} className="circle-image" alt="..." />}
                </div>
                <div>
                    <input type="text" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="btn btn-primary mt-3" onClick={handleSubmit} >Submit</button>
                </div>
            </div>
        </div>
    );
};

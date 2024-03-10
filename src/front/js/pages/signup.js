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


    const handleSubmit = async () => {
        try {
            const successRegister = await actions.register(email, password, randomProfileImage);
            if (!successRegister) return console.error("Error en el registro");

            const successLogin = await actions.login(email, password);
            if (!successLogin) return console.error("Error en el inicio de sesión");

            const user = await actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;
            console.log("Usuario obtenido:", uid);

            const newListCreationSuccess = await actions.newList(uid);
            if (!newListCreationSuccess) return console.error("Error al crear la lista");

            const newListSuccess = await actions.getAllList(uid);
            if (!newListSuccess || !newListSuccess[0]?.id) return console.error("Error al cargar la lista");

            const lid = newListSuccess[0].id;

            const newFirstGift = await actions.newFirstGift(uid, lid);
            if (!newFirstGift) return console.error("Error al agregar el primer regalo");

            const newGiftSuccess = await actions.getGiftToStore(uid, lid);
            if (!newGiftSuccess || !newGiftSuccess[0]?.id) return console.error("Error al cargar los regalos");

            const newGiftAvailableSuccess = await actions.getGiftToStoreAvailable(uid, lid);
            if (!newGiftAvailableSuccess) return console.error("Error al cargar los regalos available");

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
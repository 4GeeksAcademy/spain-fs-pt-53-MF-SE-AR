import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import "../../styles/signup.css";

export const Signup = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
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


    const onSubmit = async () => {
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("email", {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
                    {errors.email?.type === 'required' && <p role="alert">Email is required</p>}
                    {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                    <input type="text" {...register("password", {
                        required: true,
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
                    })} aria-invalid={errors.password ? "true" : "false"} value={password} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} />
                    {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                    {errors.password?.type === 'pattern' && <p role="alert">Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 8 characters long</p>}

                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                </form>
            </div>
        </div>
    );
};
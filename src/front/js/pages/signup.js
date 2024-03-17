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
    const [imageLoaded, setImageLoaded] = useState(false);


    useEffect(() => {
        actions.syncToken()
        if (store.token === "" || store.token === null) {
            fetchUserPhoto();
        } else {
            navigate("/login");
        }
    }, []);

    const fetchUserPhoto = async () => {
        try {
            const giftBuddy = await actions.getProfilePhoto();
            const randomIndex = Math.floor(Math.random() * giftBuddy.length);
            setRandomProfileImage(giftBuddy[randomIndex]);
            setImageLoaded(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


    // useEffect(() => {
    //     if (store.profileImages.length === null) {
    //         store.actions.getProfilePhoto();
    //     } else {
    //         const randomIndex = Math.floor(Math.random() * store.profileImages.length);
    //         setRandomProfileImage(store.profileImages[randomIndex]);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (store.profileImages.length === null) {
    //         store.actions.getProfilePhoto();
    //     } else {
    //         const randomIndex = Math.floor(Math.random() * store.profileImages.length);
    //         setRandomProfileImage(store.profileImages[randomIndex]);
    //     }
    // }, [store.profileImages]);

    const handleShuffle = () => {
        fetchUserPhoto();
    }

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
            setEmail("");
            setPassword("");
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
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-6 text-center">
                <h1>Welcome. Signup form:</h1>
                <div className="alert alert-bg d-flex justify-content-between align-items-top p-5">
                    <div className="firstStep d-flex-column justify-content-center align-items-center text-center">
                        <p><i className="fa-solid fa-arrow-right"></i> Pick your Gift Buddy: </p>
                        <div className="image-container" id="imageGiftBuddy">
                            {randomProfileImage && <img src={randomProfileImage} className="circle-image" alt="..." />}
                        </div>
                        <div>
                            <button onClick={handleShuffle} className="btn mt-3"><i className="fa-solid fa-shuffle"></i></button>
                        </div>
                    </div>
                    <form className="formSignup" onSubmit={handleSubmit(onSubmit)}>
                        <p className="mb-5"><i className="fa-solid fa-arrow-right"></i> Fill in your data: </p>
                        <div className="mt-5 mb-4">
                            <input type="text" {...register("email", {
                                required: true,
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
                            {errors.email?.type === 'required' && <p role="alert">Email is required</p>}
                            {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                        </div>
                        <div >
                            <input className="mb-4" type="text" {...register("password", {
                                required: true,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
                            })} aria-invalid={errors.password ? "true" : "false"} value={password} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} />
                            {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                            {errors.password?.type === 'pattern' && <p role="alert">The password must be at least 8 characters long, including a lowercase, an uppercase and a number.</p>}
                            <div>
                                <button type="submit" className="btn mt-5">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

{/* <div className="container mt-5 d-flex justify-content-center">
<div className="col-md-6">
    <h1 className="text-center">Profile</h1>
    {userData && (
        <div className="alert alert-bg">
            <h5 className="text">
                Hello {userData.name}
            </h5>
            <div className="mb-3">
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input type="text" className="form-control" value={name} readOnly={!isEditable} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="text" className="form-control" value={email} readOnly={!isEditable} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control" placeholder={"******"} value={password} readOnly={!isEditable} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" className="btn mt-3" onClick={handleOpenDelete}>Delete Account</button>
                {!isEditable && <button type="button" className="btn mt-3" onClick={() => setIsEditable(true)}>Edit</button>}
                {isEditable && <button type="button" className="btn mt-3" onClick={handleUpdateProfile}>Save</button>}
            </div>
        </div>
    )}
</div> */}
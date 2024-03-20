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

    const [isLoading, setIsLoading] = useState(false)


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
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleShuffle = () => {
        fetchUserPhoto();
    };

    const onSubmit = async () => {

        try {
            const successRegister = await actions.register(email, password, randomProfileImage);
            if (!successRegister) return console.error("Error en el registro");
            setIsLoading(true);

            const successLogin = await actions.login(email, password);
            if (!successLogin) return console.error("Error en el inicio de sesión");

            const user = await actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;
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
            alert("Registration complete! Welcome aboard!");
            navigate(`/user/${uid}/giftlist/${lid}/allGifts`);
            setIsLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (<div className="loadingMessage mt-5 text-center"><i className="fa-solid fa-gift fa-beat m-3"></i>{" "} Preparing your giftlist...</div>)
    };

    return (
        <div className="container mt-5 d-flex justify-content-center mb-3">
            <div className="col-12 form-box text-center">
                {randomProfileImage && (
                    <div>
                        <h1>Welcome, newbie!</h1>
                        <div className="row alert alert-bg justify-content-between">
                            <div className="col firstStep ">
                                <p><i className="fa-solid fa-arrow-right" ></i> Pick your Gift Buddy: </p>
                                <div className="container " id="imageGiftBuddy">
                                    {randomProfileImage && <img src={randomProfileImage} className="circle-image" alt="..." />}
                                </div>
                                <div>
                                    <button onClick={handleShuffle} className="btn mt-4 mb-4"><i className="fa-solid fa-shuffle"></i></button>
                                </div>
                            </div>
                            <form className="col formSignup" onSubmit={handleSubmit(onSubmit)}>
                                <p className=""><i className="fa-solid fa-arrow-right" ></i> Fill in your data: </p>
                                <div className="dataSignup">
                                    {/* <div className=""> */}
                                    <input className="form-control" type="text" {...register("email", {
                                        required: true,
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email?.type === 'required' && <p role="alert">Email is required</p>}
                                    {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                                    {/* </div> */}
                                    {/* <div className=""> */}
                                    <input className="form-control" type="text" {...register("password", {
                                        required: true,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
                                    })} aria-invalid={errors.password ? "true" : "false"} value={password} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} />
                                    {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                                    {errors.password?.type === 'pattern' && <p role="alert">The password must be at least 8 characters long, including a lowercase, an uppercase and a number.</p>}
                                    {/* </div> */}
                                </div>
                                <div>
                                    <button type="submit" className="btn mt-4 mb-4 ">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
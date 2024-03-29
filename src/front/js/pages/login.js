import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import "../../styles/login.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shown, setShown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.token && sessionStorage.token !== null && sessionStorage.token !== "") {
            const user = actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;

            const newListSuccess = actions.getAllList(uid);
            if (!newListSuccess || !newListSuccess[0]?.id) return console.error("Error al cargar la lista");

            const lid = newListSuccess[0].id;

            const newGiftSuccess = actions.getGiftToStore(uid, lid);
            if (newGiftSuccess === null) {
                console.warn("No gift found");
            }

            const newGiftAvailableSuccess = actions.getGiftToStoreAvailable(uid, lid);
            if (newGiftAvailableSuccess === null) {
                console.warn("No available gift found");
            }

            const newGiftPurchasedSuccess = actions.getGiftToStorePurchased(uid, lid);
            if (newGiftPurchasedSuccess === null) {
                console.warn("No purchased gift found");
            }

            navigate(`/user/${uid}/giftlist/${lid}/allGifts`);
        } else {
            actions.cleanStore()
        }
    }, []);

    const onSubmitLogin = async () => {
        try {
            const successLogin = await actions.login(email, password);
            if (!successLogin) return console.error("Error en el inicio de sesión");

            const user = await actions.getUserToStore(email);
            if (!user || !user.id) return console.error("Error al obtener el usuario");

            const uid = user.id;

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

            navigate(`/user/${uid}/giftlist/${lid}/allGifts`);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const switchShown = () => {
        setShown(!shown);
    };

    return (
        <div className="container mt-5 d-flex justify-content-center mb-3">
            <form className="col-12 form-box text-center" onSubmit={handleSubmit(onSubmitLogin)}>
                <h1>Are you a member?</h1>
                <div className="alert alert-bg">
                    <p>Newbie?<Link to="/signup">Sign up here!</Link></p>
                    <div className="mt-3">
                        <input className="form-control" type="text" {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        {errors.email?.type === 'required' && <p role="alert">Email is required to login</p>}
                        {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                    </div>
                    <div className="mt-3">
                        <div className="d-flex">
                            <input className="form-control" type={shown ? 'text' : 'password'} {...register("password", {
                                required: true
                            })} aria-invalid={errors.password ? "true" : "false"} value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                            <i class="fa-solid fa-eye" onClick={switchShown}></i>
                        </div>
                        <p><Link to="/recovery">Forgot your password?</Link></p>
                    </div>
                    <button type="submit" className="btn  mt-3" >Submit</button>
                </div>
            </form >
        </div >
    );
};


import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";



export const Recovery = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const sendLink = async () => {
        try {
            // TODO: AQUI IRAN LAS NUEVAS FUNCIONES PARA COMPROBAR EMAIL Y MANDAR LINK
            const successRecoveryToken = await actions.recoveryToken(email);
            if (!successRecoveryToken) {
                return console.error("Error. token created");
            }
            console.log("token en componente", successRecoveryToken)
            console.log(email)

            const sucessRecoveryUser = await actions.recoveryUser(successRecoveryToken, {
                frontUrl: process.env.FRONT_URL,
                token: successRecoveryToken
            });
            if (!sucessRecoveryUser) {
                return console.error("Error. user not found found");
            }
            const recoveryUrl = `${process.env.FRONT_URL}/reset-password/${sucessRecoveryUser.id}?token=${successRecoveryToken}`

            const userEmail = email;
            console.log(recoveryUrl, email)
            // const sendEmail = await actions.sendEmail(userEmail, recoveryUrl)
            // if (!sendEmail) {
            //     return console.error("Error. No email sent");
            // }
            console.log("datos usuario", sucessRecoveryUser)
            console.log("id usuario en componente", sucessRecoveryUser.id)

            console.log(recoveryUrl)
            // TODO: AGREGAR ENVIO DE EMAIL CON LINK
            alert("Recovery link sent! Please check your email")

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <form className="col-md-6 text-center" onSubmit={handleSubmit(sendLink)}>
                <h1> Password recovery </h1>
                <div className="alert alert-bg">
                    {/* <p>Newbie? <Link to="/signup">Sign up!</Link></p> */}
                    <div className="mt-3">
                        <input type="text" {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        {errors.email?.type === 'required' && <p role="alert">Email is required to recover password</p>}
                        {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                    </div>
                    <button type="submit" className="btn  mt-3" >Submit</button>
                </div>
            </form>
        </div>
    );
};
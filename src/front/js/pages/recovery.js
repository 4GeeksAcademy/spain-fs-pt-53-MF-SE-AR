import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import swal from 'sweetalert';



export const Recovery = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const sendLink = async () => {
        try {
            const successRecoveryToken = await actions.recoveryToken(email);
            if (!successRecoveryToken) {
                return console.error("Error. token created");
            }

            const sucessRecoveryUser = await actions.recoveryUser(successRecoveryToken, {
                frontUrl: process.env.FRONT_URL,
                token: successRecoveryToken
            });
            if (!sucessRecoveryUser) {
                return console.error("Error. user not found found");
            }
            const recoveryUrl = `${process.env.FRONT_URL}/reset-password/${sucessRecoveryUser.id}?token=${successRecoveryToken}`

            const userEmail = email;
            setEmail("")
            swal("Recovery link sent!", "Please, check your email", "warning");

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <form className="col-md-6 text-center" onSubmit={handleSubmit(sendLink)}>
                <h1> Password recovery </h1>
                <div className="alert alert-bg">
                    <div className="mt-3">
                        <input className="form-control" type="text" {...register("email", {
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
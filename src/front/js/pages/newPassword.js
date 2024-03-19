import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

export const NewPassword = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [email, setEmail] = useState("");
    const { uid, token } = useParams();
    const [NewPassword, setNewPassword] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const updatePassword = async () => {
            try {
                const successNewPassword = await actions.recoveryAccessUser(uid, token);
                if (!successNewPassword) {
                    alert("Error al actualizar la contraseña");
                    navigate(`/recovery`);
                } else {
                    console.log(successNewPassword)
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        updatePassword();
    }, []);

    const createPassword = async () => {
        try {
            // TODO: AQUI IRAN LAS NUEVAS FUNCIONES PARA CREAR NUEVA CONTRASEÑA
            // const successNewPassword = await actions.xxxxx();
            // if (!successNewPassword) {
            //     return console.error("Error al actualizar password");
            // }

            navigate(`/login`);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <form className="col-md-6 text-center" onSubmit={handleSubmit(createPassword)}>
                <h1> New password </h1>
                <div className="alert alert-bg">
                    {/* <p>Newbie? <Link to="/signup">Sign up!</Link></p> */}
                    <div className="mt-3">
                        <input type="text" {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })} aria-invalid={errors.email ? "true" : "false"} value={email} placeholder="Email" />
                        {errors.email?.type === 'required' && <p role="alert">Email is required to login</p>}
                        {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                    </div>
                    <div className="mt-3">
                        <input type="text"  {...register("password", {
                            required: true
                        })} aria-invalid={errors.password ? "true" : "false"} value={NewPassword} placeholder="Password" onChange={(e) => setNewPassword(e.target.value)} />
                        {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                    </div>
                    <button type="submit" className="btn  mt-3" >Update Password</button>
                </div>
            </form>
        </div>
    );
};
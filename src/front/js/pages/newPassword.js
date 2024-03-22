import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";


export const NewPassword = () => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const { uid } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
    });

    useEffect(() => {

        const updatePassword = async () => {
            try {
                const successNewPassword = await actions.recoveryAccessUser(uid, token);
                if (successNewPassword) {
                    const emailRecovered = successNewPassword.email
                    setFormData({
                        email: emailRecovered,
                        password: ""
                    });
                } else {
                    alert("Error updating password: Please try again.");
                    navigate(`/recovery`);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        updatePassword();
    }, []);

    useEffect(() => {
        setValue("email", formData.email);
        setValue("newPassword", formData.newPassword);
    }, [formData, setValue]);

    const handleInputChange = evt => {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value
        });
    };

    const createPassword = async () => {
        try {
            const successNewPassword = await actions.updatePassword(formData.newPassword, token);
            if (!successNewPassword) {
                return console.error("Error al actualizar password componente");
            }
            setFormData({
                email: "",
                password: ""
            });
            alert("Password sucessfully updated.")
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
                        <input className="form-control" type="text" {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })} aria-invalid={errors.email ? "true" : "false"} value={formData.email} placeholder="Email" onChange={handleInputChange} disabled />
                        {errors.email?.type === 'required' && <p role="alert">Email is required to login</p>}
                        {errors.email?.type === 'pattern' && <p role="alert">Invalid email format</p>}
                    </div>
                    <div className="mt-3">
                        <input className="form-control" type="text"  {...register("newPassword", {
                            required: true,
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
                        })} aria-invalid={errors.newPassword ? "true" : "false"} value={formData.newPassword} placeholder="Add a new Password" onChange={handleInputChange} />
                        {errors.newPassword?.type === 'required' && <p role="alert">Password is required</p>}
                        {errors.newPassword?.type === 'pattern' && <p role="alert">The password must be at least 8 characters long, including a lowercase, an uppercase and a number.</p>}
                    </div>
                    <button type="submit" className="btn  mt-3" >Update Password</button>
                </div>
            </form>
        </div>
    );
};
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"
import "../../styles/login.css";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleClick = async () => {
        const success = await actions.login(email, password);
        if (success) {
            const user = await actions.getUser(email);
            if (user && user.id) {
                navigate(`/`);
            } else {
                console.error("No se pudo obtener el ID del usuario");
            }
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <h1 className="text-center">Profile</h1>
                <div class="mb-3">
                    <div className="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label class="form-label">Email</label>
                        <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label class="form-label">Password</label>
                        <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label class="form-label">Invitation to your gift list</label>
                        <div className="d-grid gap-2 d-md-flex">
                        <input class="form-control" type="text" value="Readonly input here..." aria-label="readonly input example" readonly/>
                        <button className="btn btn-outline-info"><i class="fa-regular fa-copy"></i></button>
                        </div>
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="delete" className="btn btn-outline-danger mt-3" onClick={handleClick}>Delete Account</button>
                    <button type="submit" className="btn btn-primary mt-3" onClick={handleClick} >Save</button>
                </div>
            </div>
        </div>
    );
};

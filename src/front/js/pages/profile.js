import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom"
import "../../styles/login.css";


export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        actions.syncToken()
        if (store.token === "" || store.token === null) {
            navigate("/");
        } else {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const user = await actions.getUser();
            setUserData(user);
            setName(user.name); 
            setEmail(user.email);
            // Password field is optional, you can decide how to handle it
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const success = await actions.updateUser(name, email, password); 
            if (success) {
                console.log('User profile updated successfully');
                fetchUserData();
            } else {
                console.error('Failed to update user profile');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleDelete = async () => {
        const success = await actions.deleteUser(email, password);
        if (success) {
            navigate(`/`);
        } else {
            console.error("Unable to delete the account");
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <h1 className="text-center">Profile</h1>
                {userData && ( 
                    <div className="alert alert-bg">
                        Hello {userData.email}
                        <div className="mb-3">
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password:</label>
                                <input type="text" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" className="btn btn-outline-danger mt-3" onClick={handleDelete}>Delete Account</button>
                            <button type="button" className="btn btn-primary mt-3" onClick={handleUpdateProfile} >Save</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

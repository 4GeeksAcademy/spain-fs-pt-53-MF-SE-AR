import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom"
import "../../styles/profile.css";


export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [isEditable, setIsEditable] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState('');
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
            setPassword("");
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const success = await actions.updateUser(name, email, password);
            if (success) {
                console.log('User profile updated successfully');
                setIsEditable(false);
            } else {
                console.error('Failed to update user profile');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleOpenDelete = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDeleteAccount = async () => {
        try {
            const success = await actions.deleteUser(userData.id);
            if (success) {
                actions.logout()
                navigate(`/`);
            } else {
                console.error("Unable to delete the account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
        setShowModal(false);
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
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
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Are you sure you want to delete your account?</h2>
                        <button className="btn mt-3" onClick={handleCloseModal}>No, go back.</button>
                        <button className="btn mt-3" onClick={handleDeleteAccount}>Yes, delete.</button>
                    </div>
                </div>
            )}
        </div>
    );
};
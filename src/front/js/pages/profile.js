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
    const [currentPassword, setCurrentPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const { uid, lid } = useParams();
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
            setPassword(user.password);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const success = await actions.updateUser(name, email, currentPassword);
            if (success) {
                console.log('User profile updated successfully');
                setIsEditable(false);
                alert("GREAT! Your profile has been updated.");
            } else {
                console.error('Failed to update user profile');
                setIsEditable(false);
                alert("ERROR: Incorrect password. Changes won't be saved.");
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
                                <label className="form-label d-flex justify-content-between">Enter your current password to save changes.<i class="fa-solid fa-circle-exclamation" /></label>
                                <input type="password" className="form-control" value={currentPassword} readOnly={!isEditable} onChange={(e) => setCurrentPassword(e.target.value)} />
                            </div>

                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-center">
                            <button type="button" className="btn mt-3 buttonHeader" onClick={handleOpenDelete}>Delete account</button>
                            {!isEditable && <button type="button" className="btn mt-3" onClick={() => setIsEditable(true)}>Edit</button>}
                            {isEditable && <button type="button" className="btn mt-3" onClick={handleUpdateProfile}>Save</button>}
                        </div>
                    </div>
                )}
                <div className="d-grid gap-2 d-md-flex mt-4 justify-content-md-end">
                    <Link to={`/user/${uid}/giftlist/${lid}/allGifts`}>
                        <button className="noBgButton btn me-md-2" type="button"><i class="fa-solid fa-less-than"></i> Go back</button>
                    </Link>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Are you sure you want to delete your account?</h2>
                        <button className="btn mt-3" onClick={handleCloseModal}>No, cancel.</button>
                        <button className="btn mt-3 buttonHeader" onClick={handleDeleteAccount}>Yes, delete.</button>
                    </div>
                </div>
            )}
        </div>
    );
};
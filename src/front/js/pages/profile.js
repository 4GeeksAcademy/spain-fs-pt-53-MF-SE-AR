import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom"
import "../../styles/profile.css";
import { useForm } from 'react-hook-form';


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
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();


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
            setValue(setUserData(user));
            setValue(setName(user.name));
            setValue(setEmail(user.email));
            setValue(setPassword(user.password));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const onSubmitProfile = async () => {
        try {
            const success = await actions.updateUser(name, email, currentPassword);
            if (success) {
                console.log('User profile updated successfully');
                setIsEditable(false);
                alert("Great! Your profile has been updated.");
            } else {
                console.error('Failed to update user profile');
                setName(userData.name);
                setEmail(userData.email);
                setPassword('');
                setIsEditable(false);
                alert("Error: Incorrect email format or password. Changes won't be saved.");
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
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

    const handleOpenDelete = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <h1 className="text-center">Profile</h1>
                {userData && (
                    <div className="alert alert-bg ">
                        <div className="mb-3">
                            <form className="mb-3">
                                <label className="form-label">Name:</label>
                                <input type="text" className="form-control" value={name} readOnly={!isEditable} onChange={(e) => setName(e.target.value)} />
                            </form>

                            <form className="mb-3" onSubmit={handleSubmit(onSubmitProfile)}>
                                <label className="form-label">Email:</label>
                                <input type="email" placeholder="Email" {...register("Email", { required: true, pattern: /^\S+@\S+$/i })} className="form-control" value={email} readOnly={!isEditable} onChange={(e) => setEmail(e.target.value)} />
                            </form>

                            {isEditable ?
                                <form className="mb-3">
                                    <label className="form-label d-flex justify-content-between">Enter your current password to save changes:<i className="fa-solid fa-circle-exclamation" /></label>
                                    <input type="password" className="form-control" value={currentPassword} readOnly={!isEditable} onChange={(e) => setCurrentPassword(e.target.value)} />
                                </form>
                                : <></>
                            }

                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-center">
                            <button type="button" className="btn mt-3 buttonHeader" onClick={handleOpenDelete}>Delete account</button>
                            {!isEditable && <button type="button" className="btn mt-3" onClick={() => setIsEditable(true)}>Edit</button>}
                            {isEditable && <button type="submit" className="btn mt-3" onClick={onSubmitProfile}>Save</button>}
                        </div>
                    </div>
                )}
                <div className="d-grid gap-2 d-md-flex mt-4 justify-content-md-end">
                    <button className="noBgButton btn me-md-2" onClick={goBack} type="button"><i className="fa-solid fa-less-than"></i> Go back</button>
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
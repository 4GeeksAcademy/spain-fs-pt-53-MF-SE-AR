import React, { Component, useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import "../../styles/listHeader.css";
import swal from "sweetalert";

export const ListHeader = () => {
    const { uid, lid } = useParams();
    const { store, actions } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [textToCopy, setTextToCopy] = useState(`${process.env.FRONT_URL}/guest/${uid}/giftlist/${lid}`);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCopyToClipboard = () => {
        try {
            navigator.clipboard.writeText(textToCopy);
            swal("URL Copied to clipboard", "", "success");
            setShowModal(false);
        } catch (error) {
            swal("Oops!", "Something went wrong!", "error");
            console.error("Error copying to clipboard:", error);
        }
    };

    const listName = store.currentList.length > 0 ? store.currentList[0].name : "";
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="list-header">
                <div className="dropdown">
                    <button className="buttonHeader" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {listName}
                    </button>
                </div>
            </div>
            {sessionStorage.token ? (
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="buttonHeader btn me-md-2" type="button" onClick={handleOpenModal}>Share list</button>
                    <Link to={`/user/${uid}/giftlist/${lid}/new-gift`}>
                        <button className=" buttonHeader btn" type="button">Add Gift +</button>
                    </Link>
                </div>
            ) : (
                <></>
            )}
            {showModal && (
                <div className="modal">
                    <div className="header-modal-content">
                        <div className="top-icons-card d-flex justify-content-end p-2">
                            <i className="fa-solid fa-circle-xmark" id="fa-close-m" onClick={handleCloseModal}></i>
                        </div>
                        <h2>This is the url to share your available giftlist:</h2>
                        <input className="share-url"
                            type="text"
                            value={textToCopy}
                            onChange={(e) => setTextToCopy(e.target.value)}
                        />
                        <button className="btn mt-3" onClick={handleCopyToClipboard}>Copy</button>
                    </div>
                </div>
            )}
        </div>
    );
};
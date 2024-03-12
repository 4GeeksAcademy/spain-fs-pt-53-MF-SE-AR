import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const GiftForm = ({ isEditing }) => {
    const { store, actions } = useContext(Context);
    const { uid, lid, gid } = useParams();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        link: "",
        status: "Available",
    });

    useEffect(() => {
        if (isEditing && gid) {
            actions.getOneGift(uid, lid, gid)
                .then(gift => {
                    if (gift) {
                        setFormData({
                            title: gift.title,
                            link: gift.link,
                            status: gift.status,
                        });
                    }
                })
                .catch(error => console.error("Error al obtener los datos del regalo", error));
        }
    }, [isEditing, gid]);

    useEffect(() => {
        // TODO: CORREGIR EN CUANTO FUNCIONE LA TOMA DE DATOS DE LOS REGALOS PARA QUE TRABAJE CON CONDICIONAL A PERFIL PUBLICO
        actions.syncToken()
        if (store.token === "" || store.token === null) {
            navigate("/");
        } else {
            actions.getUser();
        }
    }, []);


    // useEffect(() => {
    //     if (store.token === "" || store.token === null) {
    //         navigate("/");
    //     } else {
    //         actions.getUser();
    //     }
    // }, [store.token]);

    const handleInputChange = evt => {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value
        });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        try {
            const updatedFormData = {
                ...formData,
                user_id: store.currentUser.id
            };
            console.log(updatedFormData);

            const success = await actions.saveGift(updatedFormData, isEditing, uid, lid, gid);
            if (success) {
                await actions.getGiftToStore(uid, lid);
                await actions.getGiftToStoreAvailable(uid, lid);
                await actions.getGiftToStorePurchased(uid, lid);
                setFormData({
                    title: "",
                    link: "",
                    status: "",
                });
                navigate(`/user/${store.currentUser.id}/giftlist/${store.currentList[0].id}/allGifts`);
            } else {
                // Manejar caso de fallo al guardar el regalo
                console.error("Failed to save gift");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="container-giftlist">
            <div className="contactForm container">
                <h2>{isEditing ? "Edit Gift" : "Add new gift"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Title:</span>
                            <input type="text" name="title" className="form-control" id="title01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Add a title for your gift" value={formData.title} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Link:</span>
                            <input type="text" name="link" className="form-control" id="link01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="https://www.example.com/" value={formData.link} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="inputGroupSelect01">Status:</label>
                            <select className="form-select" name="status" id="inputGroupSelect01" value={formData.status} onChange={handleInputChange} >
                                <option value="Available">Available</option>
                                <option value="Purchased">Purchased</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        <button type="submit" className="btn btn-primary">{isEditing ? "Update" : "Save"}</button>
                    </div>
                </form>

            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Link to={`/user/${store.currentUser.id}/giftlist/${store.currentList[0].id}/allGifts`}>
                    <button className="btn btn-primary me-md-2" type="button">Go back to my list</button>
                </Link>

            </div>
        </div>

    );
};
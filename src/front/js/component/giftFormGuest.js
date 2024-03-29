import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../store/appContext";

export const GiftFormGuest = ({ isEditing }) => {
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
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
            actions.getOneGiftPublic(uid, lid, gid)
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
        setValue("title", formData.title);
        setValue("link", formData.link);
        setValue("status", formData.status);
    }, [formData, setValue]);

    const handleInputChange = evt => {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value
        });
    };

    const onSubmitGift = async () => {
        try {
            const updatedFormData = {
                ...formData,
                user_id: store.currentUser.id
            };

            const success = await actions.saveGift(updatedFormData, isEditing, uid, lid, gid);
            if (success) {
                await actions.getPublicGiftToStoreAvailable(uid, lid)
                setFormData({
                    title: "",
                    link: "",
                    status: "",
                });
                navigate(`/guest/${store.currentUser.id}/giftlist/${store.currentList[0].id}/availableGifts`);
            } else {
                console.error("Failed to save gift");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <div className="container-giftlist mt-5">
            <div className="contactForm container">
                <h2>{isEditing ? "Edit Gift" : "Add new gift"}</h2>
                <form onSubmit={handleSubmit(onSubmitGift)}>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Title:</span>
                            <input type="text" name="title" {...register("title", {
                                required: true,
                                pattern: /^(?=\s*\S)([A-Za-zñÑáéíóúÁÉÍÓÚü0-9\s]){2,}$/
                            })} aria-invalid={errors.title ? "true" : "false"} className="form-control" id="title01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Add a title for your gift" value={formData.title} disabled />
                            {errors.title?.type === 'required' && <p role="alert">Please insert a title</p>}
                            {errors.title?.type === 'pattern' && <p role="alert">Title must contain at least 2 letters</p>}
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Link:</span>
                            <input type="text" name="link" {...register("link", {
                                required: true,
                                pattern: /^(https:\/\/)([^\s]+)$/,
                                maxLength: 499
                            })} aria-invalid={errors.link ? "true" : "false"} className="form-control" id="link01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="https://www.example.com/" value={formData.link} disabled />
                            {errors.link?.type === 'required' && <p role="alert">Please insert a link </p>}
                            {errors.link?.type === 'pattern' && <p role="alert"> The Link must contain https:// format</p>}
                            {errors.link?.type === 'maxLength' && <p role="alert"> Url too long</p>}                        </div>
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
                        <button type="submit" className="btn">{isEditing ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
            <div className="d-grid gap-2 d-md-flex mt-4 justify-content-md-end">
                <Link to={`/guest/${uid}/giftlist/${lid}/availableGifts`}>
                    <button className="noBgButton btn me-md-2" type="button"><i className="fa-solid fa-less-than"></i>    Go back</button>
                </Link>
            </div>
        </div>
    );
};
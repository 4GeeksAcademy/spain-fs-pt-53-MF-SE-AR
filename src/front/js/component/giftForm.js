import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../store/appContext";
import "../../styles/giftForm.css"

export const GiftForm = ({ isEditing }) => {
    const { store, actions } = useContext(Context);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm();
    const { uid, lid, gid } = useParams();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        link: "",
        status: "Available",
    });

    useEffect(() => {
        actions.syncToken()
        if (!sessionStorage.token && sessionStorage.token !== undefined && sessionStorage.token !== "") {
            navigate("/");
        } else {
            actions.getUser();
        }
    }, []);

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
            const newLink = await actions.transformLink(formData.link);
            // Actualiza el valor del enlace en el estado local y en el formulario
            console.log("link nuevo", newLink)
            setFormData(prevState => ({
                ...prevState,
                link: newLink,
            }));
            setValue("link", newLink);
            if (newLink) {
                const updatedFormData = {
                    ...formData,
                    link: newLink,
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
            }
        } catch (error) {
            console.error("Error fetching new link:", error);
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
                                pattern: /^(?=\s*\S)([A-Za-zñÑ0-9\s]){2,}$/
                            })} aria-invalid={errors.title ? "true" : "false"} className="form-control" id="title01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="Add a title for your gift" value={formData.title} onChange={handleInputChange} />
                            {errors.title?.type === 'required' && <p role="alert">Please insert a title</p>}
                            {errors.title?.type === 'pattern' && <p role="alert">Title must contain at least 3 letters</p>}
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Link:</span>
                            <input type="text" name="link" {...register("link", {
                                required: true,
                                pattern: /^(https:\/\/)([^\s]+)$/,
                            })} aria-invalid={errors.link ? "true" : "false"} className="form-control" id="link01" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder="https://www.example.com/" value={formData.link} onChange={handleInputChange} />
                            {errors.link?.type === 'required' && <p role="alert">Please insert a link </p>}
                            {errors.link?.type === 'pattern' && <p role="alert"> The Link must contain https:// format</p>}
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
                        <button type="submit" className="btn">{isEditing ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
            <div className="d-grid gap-2 d-md-flex mt-4 justify-content-md-end">
                <Link to={`/user/${uid}/giftlist/${lid}/allGifts`}>
                    <button className="noBgButton btn me-md-2" type="button"><i className="fa-solid fa-less-than"></i>    Go back</button>
                </Link>
            </div>
        </div>
    );
};
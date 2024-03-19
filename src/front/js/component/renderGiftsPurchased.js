import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";


export const RenderGiftsPurchased = () => {
    const { store, actions } = useContext(Context);
    const { uid, lid } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);


    const handleDelete = async gid => {
        try {
            const successDelete = await await actions.deleteGift(uid, lid, gid);
            if (successDelete) {
                await actions.getGiftToStore(uid, lid);
                await actions.getGiftToStoreAvailable(uid, lid);
                await actions.getGiftToStorePurchased(uid, lid);
            }

        } catch (error) {
            console.error("Error al eliminar el contacto:", error);
        }
    };

    if (isLoading) {
        return (<div className="loadingMessage mt-5"><i className="fa-solid fa-gift fa-beat m-3"></i>{" "} Preparing your gifts...</div>)
    }
    return (
        <div className="row row-cols-1 row-cols-md-2 g-4 rowCardGift">
            {store.currentPurchased.length > 0 ? (
                store.currentPurchased.map((item, index) => (
                    <div key={item.id} className="col">
                        <div className="card">
                            <div className="top-icons-card d-flex justify-content-end p-2">
                                <i className="fa-solid fa-circle-xmark" id="fa-close" onClick={() => handleDelete(item.id)}></i>
                            </div>
                            <div className="imgCard text-center">
                                {/* {randomImage && <img src={randomImage} className="card-img-top" alt="..." />} */}
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id={`title${item.id}`}>
                                                Título:
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`title${item.id}`}
                                                aria-label="Sizing example input"
                                                aria-describedby={`title${item.id}`}
                                                value={item.title}
                                                disabled
                                            />
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id={`link${item.id}`}>
                                                Link:
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control custom-link"
                                                id={`link${item.id}`}
                                                aria-label="Sizing example input"
                                                aria-describedby={`link${item.id}`}
                                                value={item.link}
                                                onClick={() => window.open(item.link, '_blank')}
                                                readOnly
                                            />
                                            {/* <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                <i className="fa-solid fa-globe"></i>
                                            </a> */}
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <label className="input-group-text" htmlFor={`status${item.id}`}>
                                                Estatus:
                                            </label>
                                            <select
                                                className="form-select"
                                                id={`status${item.id}`}
                                                value={item.status}
                                                disabled
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Purchased">Purchased</option>
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                                <div className="card-footer text-center">
                                    <Link to={`/user/${uid}/giftlist/${lid}/gifts/${item.id}/edit`}>
                                        <button href="#" className="btn ">Edit</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="w-100">
                    <h2>Oh, looks like nobody has bought any gifts yet! Don't forget, you can share your list using the "share" button up there</h2>
                </div>
            )}
        </div>
    );
}    
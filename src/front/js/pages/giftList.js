import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Link, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";
import { ListHeader } from "../component/listHeader";
import "../../styles/giftList.css";

export const GiftList = () => {
    const { store, actions } = useContext(Context);
    const { uid, lid, gid } = useParams();
    const navigate = useNavigate();
    // const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [randomGuestImage, setRandomGuestImage] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (sessionStorage.token && sessionStorage.token !== null && sessionStorage.token !== "") {
                    // Si hay un token y la ruta actual no contiene la palabra "user", redirige a "/login"
                    if (!window.location.pathname.includes("user")) {
                        actions.logout()
                        return;
                    }

                    await actions.getUserToStore(store.currentUser.email);
                    await actions.getAllList(uid);
                    await actions.getGiftToStore(uid, lid);
                    await actions.getGiftToStoreAvailable(uid, lid);
                    await actions.getGiftToStorePurchased(uid, lid);
                } else {
                    // TODO:PENDING QUE SI DA ERROR ALGUNA DE LAS FUNCIONES DE AQUI ABAJO MANDE AL INVITADO A "/"
                    actions.syncToken();
                    await actions.getPublicUserToStore(uid, lid);
                    await actions.getPublicAllList(uid, lid);
                    await actions.getPublicGiftToStoreAvailable(uid, lid);
                    navigate(`/guest/${uid}/giftlist/${lid}/availableGifts`);
                }
            } catch (error) {
                console.error("Error al ejecutar acciones:", error);
                navigate("/");
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        if (store.guestImages.length === null) {
            store.actions.getGuestPhoto();
        } else {
            const randomIndex = Math.floor(Math.random() * store.guestImages.length);
            setRandomGuestImage(store.guestImages[randomIndex]);
        }
    }, [store.guestImages]);

    return (
        <div className="container-giftlist">
            <div className="row">
                <div className="col-sm-3 bg-light">
                    <nav className="nav flex-column">
                        {sessionStorage.token ? (
                            <div className="welcoming">
                                <div className="top-welcoming d-flex align-items-center text-center">
                                    <div className="image-container m-3">
                                        <img src={store.currentUser.img} className="circle-image" alt="..." />
                                    </div>
                                    <h5>{store.currentUser.message}</h5>
                                </div>
                                <div className="sideBarLinks">
                                    <Link to={`/user/${uid}/giftlist/${lid}/allGifts`}> All Gifts </Link>
                                    <Link to={`/user/${uid}/giftlist/${lid}/availableGifts`}> Availables </Link>
                                    <Link to={`/user/${uid}/giftlist/${lid}/purchasedGifts`}> Purchased </Link>
                                    <Link to={`/user/${uid}/profile`}> Profile </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="welcoming">
                                <div className="top-welcoming d-flex align-items-center text-center">
                                    <div className="image-container m-3">
                                        {randomGuestImage && <img src={randomGuestImage} className="circle-image" alt="..." />}
                                    </div>
                                    <div>
                                        <h5>Welcome Guest</h5>
                                        <p>from {store.currentUser.email} </p>
                                    </div>
                                </div>
                                <div>
                                    <Link to={`/guest/${uid}/giftlist/${lid}/availableGifts`}> Available Gifts </Link>
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
                <div className="col-sm-9 p-5">
                    <div className="row" id="giftRow">
                        <ListHeader uid={uid} />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
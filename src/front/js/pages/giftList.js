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
                        navigate("/login");
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



    // useEffect(() => {
    //     if (store.token === "" || store.token === null) {
    //         navigate("/");
    //     } else {
    //         actions.getUser();
    //     }
    // }, [store.token]);

    // const handleTabChange = (tabId) => {
    //     setActiveTab(tabId);
    // };
    // console.log(location)
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
                                <div>
                                    <Link to={`/user/${uid}/giftlist/${lid}/allGifts`}> All Gifts </Link>
                                    <Link to={`/user/${uid}/giftlist/${lid}/availableGifts`}> Available </Link>
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
                                    <h5>Welcome Guest</h5>
                                </div>
                                <div>
                                    <Link to={`/guest/${uid}/giftlist/${lid}/availableGifts`}> Available Gifts </Link>
                                    {/* <Link to={`/guest/${uid}/giftlist/${lid}/availableGifts`}> Available </Link> SOLO VE LOS DISPONIBLES ASI QUE NO DEBE CARGARLOS TODOS SINO SOLO ESTOS*/}
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
                <div className="col-sm-9 p-5">
                    <div className="row row-cols-1 row-cols-md-2 g-4" id="giftRow">
                        <ListHeader uid={uid} />
                        <Outlet />
                    </div>
                    {/* 
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className="btn btn-primary me-md-2" type="button">Compartir</button>
                <Link to="/giftlist/new-gift"><button className="btn btn-primary" type="button">Agregar +</button></Link>
              </div> 
              REVISAR LUEGO SI LO PREFERIMOS ABAJO O ARRIBA LOS BOTONES DE MOMENTO SE DEJA ARRIBA
              */}
                </div>
            </div>
        </div>
    );

    /* <div>
        <div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                <ListHeader uid={uid} />
                AQUI SE VA A PONER EL COMPONENTE {title}
                AQUÍ AGREGAR EL COMPONENTE renderGift y pasar la uid={store.currentUser.id}
                {/* <RenderGifts uid={store.currentUser.id} /> */
    // </div>
    // </div>
    /* <div className={`tab-pane ${activeTab === 'available' ? 'active' : ''}`} id="v-pills-available" role="tabpanel" aria-labelledby="v-pills-available-tab">
                        {activeTab === 'available' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de disponibles</div>}
                    </div>
                    <div className={`tab-pane ${activeTab === 'purchased' ? 'active' : ''}`} id="v-pills-purchased" role="tabpanel" aria-labelledby="v-pills-purchased-tab">
                        {activeTab === 'purchased' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de comprados</div>}
                    </div>
                    <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                        {activeTab === 'profile' && <div>AQUI IRÁ EL COMPONENTE renderProfile</div>}
                    </div> */
    // </div> */}
};
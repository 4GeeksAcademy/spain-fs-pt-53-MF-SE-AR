import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { Link, Outlet } from "react-router-dom";
import "../../styles/giftList.css";



import { Context } from "../store/appContext";
import { ListHeader } from "../component/listHeader";
import { RenderGifts } from "../component/renderGifts";

export const GiftList = () => {
    const { store, actions } = useContext(Context);
    const { uid } = useParams();
    const navigate = useNavigate();
    // const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    // const title = location.pathname === "/giftlist/5/disponible" ? "Disponible" : location.pathname === "/giftlist/5/comprados" ? "Comprados" : "Todos los regalos"
    useEffect(() => {
        actions.syncToken()
        if (store.token === "" || store.token === null) {
            navigate("/");
        } else {
            actions.getUser();
        }
    }, []);


    useEffect(() => {
        if (store.token === "" || store.token === null) {
            navigate("/");
        } else {
            actions.getUser();
        }
    }, [store.token]);

    // const handleTabChange = (tabId) => {
    //     setActiveTab(tabId);
    // };
    // console.log(location)
    return (
        <div className="container-giftlist">
            <div className="row">
                <div className="col-sm-3 bg-light">
                    <nav className="nav flex-column">
                        <h5>Hola User</h5>
                        <Link to="/user/:uid/giftlist"> All Gifts </Link>
                        <Link to="/user/:uid/giftlist/:lid/available"> Available </Link>
                        <Link to="/user/:uid/giftlist/:lid/purchased"> Purchased </Link>
                        <Link to="/user/:uid/profile"> Profile </Link>
                    </nav>
                </div>
                <div className="col-sm-9 p-5">
                    <div className="row row-cols-1 row-cols-md-2 g-4" id="giftRow">
                        <ListHeader uid={uid} />
                        {/* TODO: ENVIAR A RENDERGIFTS EL LID (VER ABAJO EN COMENTADOS)Y REVISAR SI FUNCIONA MEJOR COMO COMPONENTE APARTE
                        <RenderGifts /> */}
                        <Outlet />
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn btn-primary me-md-2" type="button">Compartir</button>
                        <Link to="/giftlist/new-gift"> <button className="btn btn-primary" type="button">Agregar +</button></Link>
                    </div>
                </div>
            </div>
        </div>
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
    );
};
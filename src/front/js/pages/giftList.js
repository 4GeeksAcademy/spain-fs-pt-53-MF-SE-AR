import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { Link } from "react-router-dom";
import "../../styles/giftList.css";



import { Context } from "../store/appContext";
import { ListHeader } from "../component/listHeader";

export const GiftList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    const title = location.pathname === "/giftlist/5/disponible" ? "Disponible" : location.pathname === "/giftlist/5/comprados" ? "Comprados" : "Todos los regalos"
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

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };
    console.log(location)
    return (
        <div className="container-giftlist">
            <ListHeader />
            <div className="tab-content" id="v-pills-tabContent">
                <div>
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                        AQUI SE VA A PONER EL COMPONENTE {title}
                        AQUÍ AGREGAR EL COMPONENTE renderGift y pasar la uid={store.currentUser.id}
                        {/* <RenderGifts uid={store.currentUser.id} /> */}
                    </div>
                </div>
                {/* <div className={`tab-pane ${activeTab === 'available' ? 'active' : ''}`} id="v-pills-available" role="tabpanel" aria-labelledby="v-pills-available-tab">
                    {activeTab === 'available' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de disponibles</div>}
                </div>
                <div className={`tab-pane ${activeTab === 'purchased' ? 'active' : ''}`} id="v-pills-purchased" role="tabpanel" aria-labelledby="v-pills-purchased-tab">
                    {activeTab === 'purchased' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de comprados</div>}
                </div>
                <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                    {activeTab === 'profile' && <div>AQUI IRÁ EL COMPONENTE renderProfile</div>}
                </div> */}
            </div>
        </div>
    );
};
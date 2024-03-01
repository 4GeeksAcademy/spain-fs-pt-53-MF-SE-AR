import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import "../../styles/giftList.css";


import { Context } from "../store/appContext";
import { ListHeader } from "../component/listHeader";

export const GiftList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');


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

    return (
        <div className="container-giftlist">
            <div className="row">
                <div className="col-sm-3 bg-light">
                    <div className="d-flex align-items-start">
                        <div className="nav flex-column nav-pills me-3 align-items-start" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <h5>{store.currentUser.message}</h5>
                            <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabChange('home')}>Gifts</button>
                            <button className={`nav-link ${activeTab === 'available' ? 'active' : ''}`} onClick={() => handleTabChange('available')}>Available( )</button>
                            <button className={`nav-link ${activeTab === 'purchased' ? 'active' : ''}`} onClick={() => handleTabChange('purchased')}>Purchased( )</button>
                            <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>Profile</button>
                        </div>
                    </div>
                </div>
                <div className="col-sm-9 p-5">
                    <ListHeader />
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className={`tab-pane ${activeTab === 'home' ? 'active' : ''}`} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                            {activeTab === 'home' && (
                                <div className="row row-cols-1 row-cols-md-2 g-4">
                                    AQUÍ AGREGAR EL COMPONENTE renderGift y pasar la uid={store.currentUser.id}
                                    {/* <RenderGifts uid={store.currentUser.id} /> */}
                                </div>
                            )}
                        </div>
                        <div className={`tab-pane ${activeTab === 'available' ? 'active' : ''}`} id="v-pills-available" role="tabpanel" aria-labelledby="v-pills-available-tab">
                            {activeTab === 'available' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de disponibles</div>}
                        </div>
                        <div className={`tab-pane ${activeTab === 'purchased' ? 'active' : ''}`} id="v-pills-purchased" role="tabpanel" aria-labelledby="v-pills-purchased-tab">
                            {activeTab === 'purchased' && <div>AQUI IRÁ EL COMPONENTE status con el filtro de comprados</div>}
                        </div>
                        <div className={`tab-pane ${activeTab === 'profile' ? 'active' : ''}`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                            {activeTab === 'profile' && <div>AQUI IRÁ EL COMPONENTE renderProfile</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
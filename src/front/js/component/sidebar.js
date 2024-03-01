import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate } from "react-router-dom";

export const SideBar = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="d-flex align-items-start">
            <div className="nav flex-column nav-pills me-3 align-items-start" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <h5>Hola Usuario</h5>
                <button className="nav-link" onClick={() => { }}>Gifts</button>
                <button className="nav-link" onClick={() => { }}>Disponible</button>
                <button className="nav-link" onClick={() => { }}>Comprado</button>
                <button className="nav-link" onClick={() => { }}>Perfil</button>
            </div>
        </div>
    );
};
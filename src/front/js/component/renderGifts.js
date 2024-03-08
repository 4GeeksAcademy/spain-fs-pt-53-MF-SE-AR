import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";


export const RenderGifts = () => {
    const { store, actions } = useContext(Context);
    // TODO: ACTIVAR PARAMS CUANDO TENGA LA RUTA SOLUCIONADA
    // const { lid } = useParams();
    const navigate = useNavigate()
    const lid = 1


    return (
        <div>
            <h1> Todos los regalos</h1>
        </div>
    );
};
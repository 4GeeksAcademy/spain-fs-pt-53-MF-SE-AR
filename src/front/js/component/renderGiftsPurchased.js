import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate } from "react-router-dom";


export const RenderGiftsPurchased = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()


    return (
        <div>
            <h1> Todos los regalos reservados</h1>
        </div>
    );
};
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import noRegalo from "../../img/404-sin-fondo-min.png"
import "../../styles/notFound.css";
import { Link } from "react-router-dom";

export const NotFound = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center mt-5">
            <h1> Ops!</h1>
            <p>
                <img src={noRegalo} />
            </p>
            <p>
                404: NOT FOUND PAGE
            </p>
            <p> <Link to="/">Ir al Home</Link>  </p>
        </div>
    );
};
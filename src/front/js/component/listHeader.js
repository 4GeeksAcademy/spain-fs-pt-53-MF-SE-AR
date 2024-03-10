import React, { Component, useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";

export const ListHeader = () => {
    const { uid, lid } = useParams();
    const { store, actions } = useContext(Context);

    const listName = store.currentList.length > 0 ? store.currentList[0].name : "";
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="list-header">
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {listName}
                    </button>
                    <ul className="dropdown-menu">
                        {store.currentList.map((item, index) => (
                            <li key={item.id}>
                                <Link className="dropdown-item" to={`/user/${uid}/giftlist/${item.id}/allGifts`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className="btn btn-primary me-md-2" type="button">Share list</button>
                <button className="btn btn-primary" type="button">Add Gift +</button>
            </div>
        </div>
    );
};
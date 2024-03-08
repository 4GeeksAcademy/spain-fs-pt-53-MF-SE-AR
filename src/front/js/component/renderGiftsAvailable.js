import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate } from "react-router-dom";


export const RenderGiftsAvailable = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()


    return (
        <div className="col">
            <div className="card">
                <div className="top-icons-card d-flex justify-content-end p-2">
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
                <div className="imgCard text-center">
                </div>
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    Título:
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    disabled
                                />
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    Link:
                                </span>
                                <input
                                    type="text"
                                    className="form-control custom-link"
                                    aria-label="Sizing example input"
                                    readOnly
                                />
                                {/* <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    <i className="fa-solid fa-globe"></i>
                                </a> */}
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="input-group mb-3">
                                <label className="input-group-text">
                                    Estatus:
                                </label>
                                <select
                                    className="form-select"
                                    disabled
                                >
                                    <option value=""></option>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Reservado">Reservado</option>
                                </select>
                            </div>
                        </li>
                    </ul>
                    <div className="card-footer text-center">
                        <Link to="#">
                            <button href="#" className="btn btn-primary">Editar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
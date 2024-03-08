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

// return store.gift.map((item, index) => (
//     <div key={item.id} className="col">

//         <div className="card">
//             <div className="top-icons-card d-flex justify-content-end p-2">
//                 <i className="fa-solid fa-circle-xmark" onClick={() => handleDelete(item.id)}></i>
//             </div>
//             <div className="imgCard text-center">
//                 {randomImage && <img src={randomImage} className="card-img-top" alt="..." />}

//             </div>
//             <div className="card-body">
//                 <ul className="list-group list-group-flush">
//                     <li className="list-group-item">
//                         <div className="input-group mb-3">
//                             <span className="input-group-text" id={`title${item.id}`}>
//                                 Título:
//                             </span>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id={`title${item.id}`}
//                                 aria-label="Sizing example input"
//                                 aria-describedby={`title${item.id}`}
//                                 value={item.title}
//                                 disabled
//                             />
//                         </div>
//                     </li>
//                     <li className="list-group-item">
//                         <div className="input-group mb-3">
//                             <span className="input-group-text" id={`link${item.id}`}>
//                                 Link:
//                             </span>
//                             <input
//                                 type="text"
//                                 className="form-control custom-link"
//                                 id={`link${item.id}`}
//                                 aria-label="Sizing example input"
//                                 aria-describedby={`link${item.id}`}
//                                 value={item.link}
//                                 onClick={() => window.open(item.link, '_blank')}
//                                 readOnly
//                             />
//                             <a href={item.link} target="_blank" rel="noopener noreferrer">
//                                 <i className="fa-solid fa-globe"></i>
//                             </a>
//                         </div>
//                     </li>
//                     <li className="list-group-item">
//                         <div className="input-group mb-3">
//                             <label className="input-group-text" htmlFor={`status${item.id}`}>
//                                 Estatus:
//                             </label>
//                             <select
//                                 className="form-select"
//                                 id={`status${item.id}`}
//                                 value={item.status}
//                                 disabled
//                             >
//                                 <option value=""></option>
//                                 <option value="Disponible">Disponible</option>
//                                 <option value="Reservado">Reservado</option>
//                             </select>
//                         </div>
//                     </li>
//                 </ul>
//                 <div className="card-footer text-center">
//                     <Link to={`/giftlist/${uid}/edit/${item.id}`}>
//                         <button href="#" className="btn btn-primary">Editar</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     </div>
// ));
// };


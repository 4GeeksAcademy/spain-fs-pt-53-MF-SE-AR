import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";


export const RenderGifts = () => {
    const { store, actions } = useContext(Context);
    // TODO: ACTIVAR PARAMS CUANDO TENGA LA RUTA SOLUCIONADA
    const { uid, lid, gid } = useParams();
    // const navigate = useNavigate()


    const handleDelete = async idIndex => {
        console.log(idIndex)
        // try {
        //     await actions.deleteGift(idIndex);
        // } catch (error) {
        //     console.error("Error al eliminar el contacto:", error);
        // }
    };

    return (
        // TODO: REVISAR PORQUE SE DAÑO EL GRID DE LA PLANTILLA A DOS COLUMNAS
        <div>
            {store.currentGift.length > 0 ? (
                store.currentGift.map((item, index) => (
                    <div key={item.id} className="col">

                        <div className="card">
                            <div className="top-icons-card d-flex justify-content-end p-2">
                                <i className="fa-solid fa-circle-xmark" onClick={() => handleDelete(item.id)}></i>
                            </div>
                            <div className="imgCard text-center">
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id={`title${item.id}`}>
                                                Título:
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`title${item.id}`}
                                                aria-label="Sizing example input"
                                                aria-describedby={`title${item.id}`}
                                                value={item.title}
                                                disabled
                                            />
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id={`link${item.id}`}>
                                                Link:
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control custom-link"
                                                id={`link${item.id}`}
                                                aria-label="Sizing example input"
                                                aria-describedby={`link${item.id}`}
                                                value={item.link}
                                                onClick={() => window.open(item.link, '_blank')}
                                                readOnly
                                            />
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="input-group mb-3">
                                            <label className="input-group-text" htmlFor={`status${item.id}`}>
                                                Estatus:
                                            </label>
                                            <select
                                                className="form-select"
                                                id={`status${item.id}`}
                                                value={item.status}
                                                disabled
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Purchased">Purchased</option>
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                                {sessionStorage.token ? (
                                    <div className="card-footer text-center">
                                        <Link to={`/user/${uid}/giftlist/${lid}/gifts/${item.id}/edit`}>
                                            <button href="#" className="btn btn-primary">Editar</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="card-footer text-center">
                                        <Link to={`/guest/${uid}/giftlist/${lid}/gifts/${item.id}/edit`}>
                                            <button href="#" className="btn btn-primary">Editar</button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <h2>Oops! It looks like your gift list is empty at the moment. Why not add some gifts to brighten it up? Click the 'Add Gift' button to start adding gifts to your list! 🎁✨</h2>
            )}
        </div>
    );
}

// return store.currentGift.map((item, index) => (
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
//                             <i className="fa-solid fa-globe"></i>
//                         </a>
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
//                                 <option value="Available">Available</option>
//                                 <option value="Purchased">Purchased</option>
//                             </select>
//                         </div>
//                     </li>
//                 </ul>
//                 <div className="card-footer text-center">
//                     <Link to={`/user/${uid}/giftlist/${lid}/gifts/${item.id}`}>
//                         <button href="#" className="btn btn-primary">Editar</button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     </div>
// ));
// };

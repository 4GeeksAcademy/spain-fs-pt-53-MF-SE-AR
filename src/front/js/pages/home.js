import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		if (store.token && store.token !== null && store.token !== "") {
			setIsAuthenticated(true);
			actions.getUser();
		} else {
			setIsAuthenticated(false);
		}
	}, [store.token]);

	return (
		<div className="text-center mt-5">
			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			{isAuthenticated ? <div className="alert alert-info">
				{store.currentUser.message}
			</div> : <div className="alert alert-info"> To know more about the app please log in </div>}
			<p>
				Aquí pronto estará la home del proyecto final.
			</p>
		</div>
	);
};

import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import homeGift from "../../img/Boxing-day-amico.png";
import howToGift1 from "../../img/Jewelry-shop-amico.png"
import howToGift2 from "../../img/Pleasant-surprise-amico.png"
import howToGift3 from "../../img/Gift-amico.png"

import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		console.log("useEffect Home")

		if (sessionStorage.token && sessionStorage.token !== null && sessionStorage.token !== "") {
			console.log(sessionStorage.token)
			setIsAuthenticated(true);
			actions.getUserToStore();
		} else {
			setIsAuthenticated(false);
			actions.cleanStore()
		}
	}, [sessionStorage.token]);

	return (
		<div className="container mt-5 ">
			<div className="d-flex justify-content-around">
				<div className="">
					<h1>
						Welcome to GiftBuddy!
					</h1>
					<p>Where everybody can make a present that really matters.</p>
					<Link to="/signup">
						<button className="btn">Create your giftlist</button>
					</Link>
				</div>
				<div className="d-inline">
					<img src={homeGift} className="img-drawing " />
				</div>
			</div>
			<h2>
				How does it work?
			</h2>
			<div className="d-flex justify-content-around" >
				<div className="d-inline">
					<p>Make a list with the presents that you or your beloved would like to receive.</p>
					<img src={howToGift1} className="img-drawing " />
				</div>
				<div className="d-inline">
					<p>Send the list to the party guests so they can choose the one they want to give.</p>
					<img src={howToGift2} className="img-drawing " />
				</div>
				<div className="d-inline">
					<p>You won't know who picked it up, just that someone chose it.</p>
					<img src={howToGift3} className="img-drawing " />
				</div>
			</div>
			{/* {isAuthenticated ? <div className="alert alert-info">
				{store.currentUser.message}
			</div> : <div className="alert alert-info"> To know more about the app, please log in or sign up.</div>} */}
		</div>
	);
};

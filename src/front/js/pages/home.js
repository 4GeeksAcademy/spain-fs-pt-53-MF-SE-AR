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

		if (sessionStorage.token && sessionStorage.token !== null && sessionStorage.token !== "") {

			setIsAuthenticated(true);
			actions.getUserToStore();
		} else {
			setIsAuthenticated(false);
			actions.cleanStore()
		}
	}, [sessionStorage.token]);

	return (
		<div className="container mt-5 ">
			<div className="home-welcome row">
				<div className="col">
					<h1>
						Welcome to GiftBuddy!
					</h1>
					<p>Where everybody can make a gift that really matters.</p>
					<Link to="/signup">
						<button className="btn">Start now</button>
					</Link>
				</div>
				<div className="col">
					<img src={homeGift} className="img-drawing " />
				</div>
			</div>
			<div className="row home-steps" >
				<h2>
					How does it work?
				</h2>
				<div className="box-steps col">
					<p> 1 <i className="fa-solid fa-arrow-right" ></i> Make a list of the presents that you or your beloved would like to receive.</p>
					<img src={howToGift1} className="img-drawing " />
				</div>
				<div className="box-steps col">
					<p> 2 <i className="fa-solid fa-arrow-right" ></i> Send the list to the party guests so they can choose the one they want to give.</p>
					<img src={howToGift2} className="img-drawing " />
				</div>
				<div className="box-steps col">
					<p> 3 <i className="fa-solid fa-arrow-right" ></i> You won't know who picked it up, just that someone chose it.</p>
					<img src={howToGift3} className="img-drawing " />
				</div>
			</div>
			{/* {isAuthenticated ? <div className="alert alert-info">
				{store.currentUser.message}
			</div> : <div className="alert alert-info"> To know more about the app, please log in or sign up.</div>} */}
		</div>
	);
};

import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	const handleClick = () => {
		actions.logout()
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{!store.token ? <Link to="/login">
						<button className="btn btn-primary">Log in</button>
					</Link> :
						<button onClick={handleClick} className="btn btn-primary">Log out</button>
					}

				</div>
			</div>
		</nav>
	);
};

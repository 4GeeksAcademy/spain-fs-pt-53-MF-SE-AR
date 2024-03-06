import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Logo from "../../img/Logo-completo-tr.png"


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	const handleClick = () => {
		actions.logout()
		navigate('/')
	}

	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={Logo} className="Logo"/>
					</span>	
				</Link>
				<div className="ml-auto">
					{!store.token ? <Link to="/login">
						<button className="btn">Log in</button>
					</Link> :
						<button onClick={handleClick} className="btn">Log out</button>
					}
				</div>
			</div>
		</nav>
	);
};

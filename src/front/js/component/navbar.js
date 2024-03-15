import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../img/Logo-completo-tr.png"
import "../../styles/navbar.css"


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const location = useLocation();
	const { pathname } = location;
	const isHome = pathname === "/";

	const handleClick = () => {
		actions.logout()
		navigate('/')
	}
	console.log(store)
	const handleList = () => {
		navigate(`/user/${store.currentUser.id}/giftlist/${store.currentList[0].id}/allGifts`)
	}

	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={Logo} className="Logo" />
					</span>
				</Link>
				<div className="ml-auto">
					{!sessionStorage.token ? (
						<Link to="/login">
							<button className="noBgButton btn">Log in</button>
						</Link>
					) : (
						<div className="navBarButtons d-flex">
							{isHome && (
								<button onClick={handleList} className="btn mr-2">Go to my lists</button>
							)}
							<button onClick={handleClick} className="noBgButton btn ml-2">Log out</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

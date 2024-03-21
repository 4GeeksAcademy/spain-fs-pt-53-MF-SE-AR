import React, { Component } from "react";
import SimpleLogo from "../../img/Logo-solo-tr.png"


export const Footer = () => (
	<footer className="footer sticky-sm-bottom container-fluid">
		<div className="container nav-fill d-flex">
			<p className="nav-item footer-text">
				🎁 Made by{" "}
				<a href="https://github.com/SabrinaESMO">Sesmo.dev</a>
				<span className="name-separator"> & </span>
				<a href="https://www.linkedin.com/in/mjuliafb/">MJ</a>
			</p>
			<img src={SimpleLogo} className="footer-logo">
			</img>
		</div>
	</footer>
);

// src/components/Navbar.js
import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="bg-white shadow">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					{/* Logo ou Titre */}
					<div className="flex-shrink-0">
						<Link to="/" className="text-xl font-bold text-gray-800">
							Esport'IF
						</Link>
					</div>

					{/* Menu */}
					<div>
						<ul className="flex space-x-4">
							<li>
								<NavLink
									to="/"
									className={({ isActive }) =>
										isActive
											? "text-blue-500 border-b-2 border-blue-500"
											: "text-gray-600 hover:text-blue-500"
									}
								>
									Accueil
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/about"
									className={({ isActive }) =>
										isActive
											? "text-blue-500 border-b-2 border-blue-500"
											: "text-gray-600 hover:text-blue-500"
									}
								>
									À propos
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/contact"
									className={({ isActive }) =>
										isActive
											? "text-blue-500 border-b-2 border-blue-500"
											: "text-gray-600 hover:text-blue-500"
									}
								>
									Contact
								</NavLink>
							</li>
							{/* Ajoutez d'autres liens de navigation ici */}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

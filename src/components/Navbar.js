import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="absolute top-0 left-0 w-full z-10">
			<div className="container mx-auto px-4">
				<div className="flex justify-center items-center h-16">
					<ul className="flex space-x-4">
						<li>
							<NavLink
								to="/"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								Accueil
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/about"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								À propos
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/contact"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								Contact
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

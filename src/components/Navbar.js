import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="absolute top-0 left-0 w-full z-10">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16 relative">
					{/* Logo à gauche */}
					<NavLink to="/" className="flex items-start mt-3 -ml-8">
						<img
							src="/logo.png"
							alt="Logo"
							className="h-8 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
						/>
					</NavLink>

					{/* Liens de navigation centrés */}
					<ul className="flex space-x-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
								Home
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
								About
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/games"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								Games
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/tournement"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								Tournaments
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/teams"
								className={({ isActive }) =>
									`text-white px-4 py-2 ${
										isActive
											? "border-b-2 border-white"
											: "hover:backdrop-blur-sm hover:bg-neutral-600 hover:bg-opacity-50 rounded-lg transition duration-300"
									}`
								}
							>
								Teams
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

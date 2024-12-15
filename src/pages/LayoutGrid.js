import React from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const LayoutGrid = ({ title, data, loading, error, onClick }) => {
	if (loading)
		return (
			<div className="flex justify-center items-center min-h-[80vh]">
				<ClipLoader color="#ffffff" size={50} />
			</div>
		);

	if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
			<h2 className="text-4xl font-bold text-white text-center mb-8">
				{title}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{data.map((item, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: index * 0.2, // Décalage pour chaque carte
							ease: "easeOut",
						}}
						className="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg hover:bg-gray-700 transition-transform duration-300 hover:scale-105 cursor-pointer"
						onClick={() => onClick(item)}
					>
						{item.logo && (
							<img
								src={item.logo}
								alt={`Logo of ${item.name}`}
								className="w-24 h-24 object-contain mb-4"
							/>
						)}
						<span className="text-white text-center text-base font-semibold">
							{item.name}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default LayoutGrid;

'use client';

import { motion } from 'framer-motion';
import { FaPlane } from 'react-icons/fa';

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center overflow-hidden">
			
			<div className="relative w-[400px] h-[80px] mb-10">
				<div className="absolute top-1/2 w-full border-t-2 border-dashed border-gray-300" />

				<motion.div
					className="absolute top-1/2 -translate-y-1/2"
					animate={{ x: [0, 350] }}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: 'linear',
					}}
				>
					<FaPlane className="text-4xl text-blue-500 rotate-45" />
				</motion.div>
			</div>

			<h1 className="text-8xl font-bold">404</h1>

			<p className="mt-4 text-lg text-gray-500">
				Oops! This destination isn&apos;t on our itinerary.
			</p>
		</div>
	);
}
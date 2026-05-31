/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
		],
		unoptimized: true,
	},
	productionBrowserSourceMaps: false,
};

export default nextConfig;

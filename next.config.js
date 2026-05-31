import dns from "node:dns";

// Configure DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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

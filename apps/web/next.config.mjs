import "./src/env.js";

/** @type {import('next').NextConfig} */
export default {
	reactStrictMode: false,
	transpilePackages: ["@sweetreply/shared", "../../server"],
};

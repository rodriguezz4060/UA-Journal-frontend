/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'leonardo.osnova.io',
			'uajournal-post.s3.amazonaws.com',
			'uajournal-post.s3.eu-central-1.amazonaws.com'
		]
	}
}

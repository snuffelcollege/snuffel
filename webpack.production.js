const { merge } = require("webpack-merge");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
	mode: "production",
	output: {
		filename: "bundle.min.js",
	},
	devServer: undefined,
	devtool: "source-map",
	performance: {
		maxEntrypointSize: 900000,
		maxAssetSize: 900000,
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
		],
	},
});

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const babelConfig = require("./babel.config");
const { target, windowTitle } = require("./snuffel.config")
const DotEnv = require('dotenv-webpack');

if (!target) {
	throw new Error(
		"target not found in snuffel.config.js. You must define the ID of the parent element which the game hooks onto.",
	);
}

module.exports = {
	output: {
		path: resolve(__dirname, "./dist"),
		clean: true,
	},
	devServer: {
		watchFiles: ["./src/**/*.ts", "./assets/**/*.*"],
		server: "https",
		static: ["./assets"],
		compress: true,
		port: 8080,
	},
	mode: "development",
	devtool: "eval-source-map",
	resolve: {
		alias: {
			"@assets": resolve(__dirname, "./assets"),
			"@gameobjects": resolve(__dirname, "./src/GameObjects"),
			"@entities": resolve(__dirname, "./src/GameObjects/Entities"),
		},
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: babelConfig.presets,
							plugins: babelConfig.plugins,
							cacheDirectory: true,
						},
					},
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(vert|frag)$/,
				type: "asset/source",
			},
			{
				test: /\.(gif|png|jpe?g|svg|xml|json)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new DotEnv(),
		new webpack.DefinePlugin({
			CANVAS_RENDERER: JSON.stringify(true),
			WEBGL_RENDERER: JSON.stringify(true),
		}),
		new HtmlWebpackPlugin({
			title: windowTitle,
			target: target,
			template: "./index.html",
			inject: false,
		}),
	],
};

const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ENV = process.env.NODE_ENV || 'development';
const extractSass = new ExtractTextPlugin({
	filename: "styles.css",
	disable: ENV === 'development'
});

module.exports = {
	entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, "public"),
			publicPath: "/public/",
			filename: 'bundle.js'
		},
		devtool: ENV==='production' ? false : 'cheap-module-eval-source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
				},
				{
					test: /\.scss$/,
					loader: extractSass.extract({
						use: [{
							loader: "css-loader"
						}, {
							loader: "sass-loader"
						}],
						// use style-loader in development
						fallback: "style-loader"
					})
				}
			]
		},
		plugins: ([
			extractSass,
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(ENV)
			})
		]).concat(ENV==='production' ? [
			new webpack.optimize.UglifyJsPlugin({
				output: {
					comments: false
				},
				compress: {
					warnings: false,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
					negate_iife: false
				}
			})
		] : [])
 };

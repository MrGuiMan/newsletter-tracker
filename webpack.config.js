const path = require("path");
const webpack = require('webpack');
const ENV = process.env.NODE_ENV || 'development';

module.exports = {
	entry: './src/index.js',
		output: {
			path: path.resolve(__dirname, "public"),
			publicPath: "/public/",
			filename: 'bundle.js'
		},
		devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
				}
			]
		},
		plugins: ([
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

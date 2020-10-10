const path = require('path');
const webpack = require('webpack');

module.exports = {
	module: {
		rules: [
			{
				test: /\.[tj]sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
			},
			{
				test: /\.(s[ac]ss)$/,
				exclude: /node_modules/,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
	},
	entry: './src/index.tsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public/built/'),
		publicPath: 'built/',
	},
	plugins: [new webpack.HotModuleReplacementPlugin({ multistep: true })],
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		watchContentBase: true,
		port: 9000,
		hot: true,
	},
};

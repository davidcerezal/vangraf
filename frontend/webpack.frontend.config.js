var path = require( 'path' );
const { merge } = require( 'webpack-merge' );
const webpackConfigBase = require( './webpack.base.config.js' );
//const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin;

const BUILD_FOLDER_PATH = './dist';

const webpackConfigDev = {
	output: {
		publicPath: '/',
		path: path.resolve( __dirname, BUILD_FOLDER_PATH )
	},
	optimization: {
		minimize: false
	},
	plugins: [
		//new BundleAnalyzerPlugin()
	],
	watchOptions: {
		aggregateTimeout: 200,
		poll: 1000
	},
	devServer: {
		static: path.resolve( __dirname, BUILD_FOLDER_PATH ),
		compress: true,
		port: 9002,
		hot: true,
	},
	devtool: 'source-map',	
	mode: 'development'
};

module.exports = merge( webpackConfigBase( true ), webpackConfigDev );
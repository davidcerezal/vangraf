/* COMMENTS AND TUTORIALS
 Development live debugging with webpack-dev-server:
 https://desarrolloweb.com/articulos/servidor-desarrollo-webpack.html
 https://webpack.js.org/configuration/dev-server/

 */

var path = require( 'path' );

const webpack = require( 'webpack' );
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CaseSensitivePathsPlugin = require( 'case-sensitive-paths-webpack-plugin' );

module.exports = ( dev ) => {
	return {
		entry: {
			main: './src/project/js/main.js',
			css: [ './src/project/css/overrides.css' ]
		},
		output: {
			filename: '[name].js?v[contenthash]',
			library: {
				name: 'library',	//CONFICONFI also uses library, so change accordingly
				type: 'assign-properties'
			}
		},
		resolve: {
			alias: {
				handlebars: 'handlebars/dist/handlebars.js',
				root: path.resolve( __dirname, '' ),
				main: path.resolve( __dirname, './src' ),
				project: path.resolve( __dirname, './src/project' )
			},
			fallback: {
				crypto: require.resolve( 'crypto-browserify' ),
				stream: require.resolve( 'stream-browserify' ),
				buffer: require.resolve( 'buffer' )
			}
		},
		target: 'web',
		module: {
			rules: [
				{
					test: /\.html$/,
					use: {
						loader: 'html-loader',
						options: {
							minimize: !dev
						}
					}
				},
				{
					test: /\.worker\.js$/,
					use: {
						loader: 'worker-loader'
					}					
				},		
				{ /* IMPORT FOR CSS MODULES. CSS FILES THAT ARE IMPORTED FROM JS */
					test: /\.css$/,
					use: [ 'to-string-loader',{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: 'global',
							sourceMap: dev
						}
					}
					],
					include: /\.module\.css$/,
				},
				{ /* IMPORT FOR CSS FILES. CSS FILES THAT ARE ADDED FROM WEBPACK & CSS FILES */
					test: /\.css$/,
					use: [ {
						loader: MiniCssExtractPlugin.loader,
						options: {}
					}, {
						loader: 'css-loader',
						options: { sourceMap: dev }
					}
					],
					exclude: /\.module\.css$/,
				},
				{
					test: /\.hbs$/,
					use: [ {
						loader: 'html-loader',
						options: {
							minimize: false	//ALWAYS FALSE, MINIMIZING BREAKS HANDLEBARS
						}
					} ]
				},
				{
					test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
					type: 'asset/resource'
				}
			]
		},	
		plugins: [
			new HtmlWebPackPlugin( {
				template: './src/index.html',
				filename: './index.html',
				chunks: [ 'main', 'css' ]
			} ),
			new MiniCssExtractPlugin( {
				filename: '[name].css',
				chunkFilename: '[id].css'
			} ),
			new webpack.DefinePlugin( {
				'process.env.npm_package_version': JSON.stringify( process.env.npm_package_version )
			} ),
			new CaseSensitivePathsPlugin()
		],
		stats: {
			colors: true
		},
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000
		}
	};
};
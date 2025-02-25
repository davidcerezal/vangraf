var path = require('path');
const { merge } = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebpackUpdateVersionPlugin = require('webpack-update-version-plugin');

const BUILD_FOLDER_PATH = '../built/frontend';

const webpackConfigDev = (isProd) => {
  return {
    output: {
      path: path.resolve(__dirname, BUILD_FOLDER_PATH)
    },
    resolve: {
      alias: {
        wwwdata: path.resolve(__dirname, '../wwwdata')
      }
    },
    optimization: {
      minimize: isProd,
      splitChunks: {
        chunks: 'all',          
      },
      runtimeChunk: 'single', 
      minimizer: [
        new WebpackUpdateVersionPlugin(),
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: /@license/i
            },
            warnings: isProd,
            compress: {
              pure_funcs: ['console.info', 'console.debug', 'console.warn']
            }
          },
          extractComments: isProd,
          parallel: isProd
        }),
        new CssMinimizerPlugin()
      ],
    },
    plugins: [],
    watch: false,
    devtool: false,
    mode: 'production'
  };
};

module.exports = (env) => {
  let isProd = typeof env.snap === 'undefined';
  var finalPath = env.snap ? env.snap.toString() : path.resolve(__dirname, 'build');

  return merge(webpackConfigBase(!isProd), webpackConfigDev(isProd, finalPath));
};

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.resolve(__dirname, 'app-react', 'index'),
  build: path.resolve(__dirname, 'public', 'build'),
  node: path.resolve(__dirname, 'node_modules'),
};


const config = {

  devtool: 'cheap-module-source-map',

  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    PATHS.app,
  ],

  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/build/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel?cacheDirectory'],
        exclude: [PATHS.node],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss'],
      },
      {
        test: /\.svg$/,
        loaders: ['file', 'svgo'],
      },
    ],
  },

  postcss: () => [autoprefixer],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

};

module.exports = config;

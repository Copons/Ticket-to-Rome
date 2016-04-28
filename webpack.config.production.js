const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');

const PATHS = {
  app: path.resolve(__dirname, 'app', 'index.js'),
  build: path.resolve(__dirname, 'public', 'build'),
  node: path.resolve(__dirname, 'node_modules'),
};


const config = {

  //devtool: 'source-map',

  entry: PATHS.app,

  output: {
    path: PATHS.build,
    publicPath: '/build/',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: [PATHS.node],
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

  postcss: () => [autoprefixer, precss],

};

module.exports = config;

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.resolve(__dirname, 'app-react', 'index.jsx'),
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],

};

module.exports = config;

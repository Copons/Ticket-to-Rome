const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');

const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  //style: path.join(__dirname, 'app/main.css'),
};

const common = {
  entry: {
    app: PATHS.app,
    //style: PATHS.style,
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      //template: 'node_modules/html-webpack-template/index.ejs',
      template: 'app/index.ejs',
      title: 'Ticket to Rome',
      appMountId: 'ttr',
      inject: false,
    }),
  ],
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'error-only',
      host: process.env.HOST,
      port: process.env.PORT,
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css', 'postcss'],
          include: PATHS.app,
        },
      ],
    },
    postcss: function () {
      return [autoprefixer, precss];
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies),
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          //loader: ExtractTextPlugin.extract('style', 'css', 'postcss'),
          loaders: ['style', 'css', 'postcss'],
          include: PATHS.app,
        },
      ],
    },
    postcss: function () {
      return [autoprefixer, precss];
    },
    plugins: [
      new CleanPlugin([PATHS.build], { verbose: false }),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
      //new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
      }),
    ],
  });
}

'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

module.exports = () => {
  const compiler = webpack(webpackConfig);
  let bundleStart = null;

  compiler.plugin('compile', () => {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    console.log(`Bundled in ${Date.now() - bundleStart}ms.`);
  });

  const bundler = new WebpackDevServer(compiler, {
    publicPath: '/build/',
    hot: true,
    quiet: false,
    noInfo: true,
    stats: { colors: true },
  });

  bundler.listen(8080, 'localhost', () => {
    console.log('Bundling project, please wait...');
  });
};

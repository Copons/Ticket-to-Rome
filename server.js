'use strict';

const isProduction = process.env.NODE_ENV === 'production';
let port = isProduction ? process.env.PORT : 3000;
if (!port) port = 3000;

const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));

const http = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(http);

io.on('connection', () => {
  console.log('connection!');
});

http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

if (!isProduction) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./webpack.config.js');

  new WebpackDevServer(webpack(webpackConfig), {
    hot: false,
    noInfo: true,
    quiet: false,
    publicPath: '/build/',
    proxy: { '*': 'http://localhost:3000' },
    stats: { colors: true },
  }).listen(8080, 'localhost', err => {
    if (err) console.log(err);
    console.log('Webpack Dev Server listening at 8080');
  });
}

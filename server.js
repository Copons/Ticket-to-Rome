'use strict';

const express = require('express');
const path = require('path');
const rimraf = require('rimraf');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;
const publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

if (!isProduction) {
  rimraf(path.resolve(__dirname, 'public', 'build'), err => {
    if (err) {
      console.log(err);
    }
  });
  const bundle = require('./server/bundle.js');
  bundle();
  app.all('/build/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:8080',
    });
  });
}

proxy.on('error', () => {
  console.log('Could not connect to proxy, please try again.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

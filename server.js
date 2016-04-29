import path from 'path';
import express from 'express';
import http from 'http';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import socket from './server-redux/socket';

const isProduction = process.env.NODE_ENV === 'production';
let port = isProduction ? process.env.PORT : 3000;
if (!port) port = 3000;

const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));

const server = http.Server(app); // eslint-disable-line new-cap

socket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

if (!isProduction) {
  new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    inline: true,
    noInfo: true,
    quiet: false,
    historyApiFallback: true,
    publicPath: webpackConfig.output.publicPath,
    proxy: { '*': 'http://localhost:3000' },
    stats: { colors: true },
  }).listen(8080, 'localhost', err => {
    if (err) console.log(err);
    console.log('Webpack Dev Server listening at 8080');
  });
}

export default server;

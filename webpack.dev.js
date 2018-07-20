const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://193.62.52.185:5000/gifts')
    }),
    new HtmlWebPackPlugin({
      template: __dirname + '/public/index.html',
      filename: 'index.html'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3100,
      proxy: 'http://localhost:39093/',
      open: false,
      ui: false
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    host: 'localhost',
    port: 39093,
    historyApiFallback: true
  }
});

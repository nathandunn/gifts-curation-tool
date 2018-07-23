const webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: 'inline-sourcemap',
  entry: ['babel-polyfill', __dirname + '/src/ui/index.jsx'],
  output: {
    path: __dirname + '/build',
    filename: 'app.[hash].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: [".jsx", ".js"]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }, {
      test: /\.(css|sass|scss)$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "sass-loader" // compiles Sass to CSS
      }]
    }]
  }
};

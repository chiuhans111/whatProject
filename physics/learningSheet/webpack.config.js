const ClosureCompiler = require('google-closure-compiler-js').webpack;
const path = require('path');
var webpack = require('webpack')
module.exports = {
  entry: path.join(__dirname, 'main'),
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname, '')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|md)$/,
        loader: 'url-loader?limit=100000'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.vue']
  },
  devServer: {
    publicPath: '/'
  }
};
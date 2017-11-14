const path = require('path');
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
        exclude: /node_modules/
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
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
  devtool: 'cheap-eval-source-map',
  devServer: {
    publicPath: '/'
  }
};
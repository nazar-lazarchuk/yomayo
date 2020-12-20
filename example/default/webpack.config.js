const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    filename: 'main.js',
    library: 'app',
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
  },
  plugins: [
    new webpack.ProvidePlugin({
      jsx: require.resolve('yomayo/jsx'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

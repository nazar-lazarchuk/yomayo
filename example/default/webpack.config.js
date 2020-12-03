const path = require('path');

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
  },
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
  plugins: [],
};

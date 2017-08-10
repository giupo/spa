const path = require('path');

module.exports = {
  entry: './js/spa.js',
  output: {
    path: path.resolve(__dirname, "public"),
    filename: 'app.js'
  },

/*  node: {
    fs: "empty"
  },
*/
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.pug$/,
        use: ['pug-loader']
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: false,
    port: 8082,
    hot: true,
    inline: true,
    host: "0.0.0.0",
    public: "osi2-phys-601.utenze.bankit.it:8082"
  }
};

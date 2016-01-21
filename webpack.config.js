module.exports = {

  entry: './main.js',

  output: {
    filename: 'x-util.js',
    library: 'xutil',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  resolve: {
    extensions: ['', '.js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel'
    }]
  }
};

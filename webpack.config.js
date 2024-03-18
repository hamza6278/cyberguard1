const webpack = require('webpack');

module.exports = {
  // ... other webpack configuration

  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('readable-stream'),
    },
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('readable-stream'),
    }),
  ],
};

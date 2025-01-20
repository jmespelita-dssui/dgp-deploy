const webpack = require('webpack') // Import webpack via CommonJS

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'), // Polyfill for crypto
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      crypto: 'crypto-browserify', // Provide the polyfill globally
    }),
  ],
}

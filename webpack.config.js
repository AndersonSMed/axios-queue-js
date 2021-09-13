/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'axiosQueue.min.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: 'AxiosQueue',
    libraryTarget: 'umd',
  },
};

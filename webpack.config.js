require('dotenv').config();
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

module.exports = {
  entry: {
    plugin: './src/plugin.ts',
    propertyinspector: './src/propertyinspector.ts',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist/' + process.env.PLUGIN_NS + '.sdPlugin/js'),
    library: 'connectElgatoStreamDeckSocket',
    libraryExport: 'default',
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: ['./dist'],
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: path.resolve(__dirname, 'dist/' + process.env.PLUGIN_NS + '.sdPlugin'),
          toType: 'dir',
          transform: {
            transformer(content, path) {
              return content.toString().replace('{{ PLUGIN_NS }}', process.env.PLUGIN_NS);
            },
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    splitChunks: {},
  },
};

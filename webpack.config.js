const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const pkg = require('./package.json');

module.exports = (env, options) => {
  let pluginNs = pkg['streamdeck-plugin'].namespace;
  let pluginName = pkg['streamdeck-plugin'].name;

  if (options.mode === 'development') {
    pluginNs = 'dev.' + pluginNs;
    pluginName = pluginName + ' (dev)';
  }

  return {
    entry: {
      plugin: './src/plugin.ts',
      propertyinspector: './src/propertyinspector.ts',
    },
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist/' + pluginNs + '.sdPlugin/js'),
      library: 'connectElgatoStreamDeckSocket',
      libraryExport: 'default',
    },
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/,
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
            to: path.resolve(__dirname, 'dist/' + pluginNs + '.sdPlugin'),
            toType: 'dir',
            transform: {
              transformer(content, path) {
                if (!path.match(/\.(json|html)/)) {
                  return content;
                }
                return content
                  .toString()
                  .replace(/\{\{ PLUGIN_NS \}\}/g, pluginNs)
                  .replace(/\{\{ PLUGIN_NAME \}\}/g, pluginName);
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
};

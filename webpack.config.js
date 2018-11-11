const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PUB_DIR = path.resolve(__dirname, 'public');
const SRC_DIR = path.resolve(__dirname, 'src');

function isDev(env) {
  return env === 'development';
}

function isProd(env) {
  return env === 'production';
}

function getPlugins(env) {
  let plugins = [
    new ExtractTextPlugin('styles.css')
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    // new HtmlWebpackPlugin({ template: 'template.html' })
  ];
  if (isProd(env)) {
    plugins = plugins.concat([new UglifyJsPlugin()]);
    plugins = plugins.concat([new HtmlWebpackPlugin({ template: 'template.html' })]);
  }
  return plugins;
}

module.exports = (env, argv) => ({
  entry: {
    vendor: ['axios'],
    app: `${SRC_DIR}/index.jsx`
  },
  output: {
    path: PUB_DIR,
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: true,
                sourceMap: isDev(argv.mode)
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // modules: true,
                sourceMap: isDev(argv.mode)
              }
            },
            {
              loader: 'scss-loader',
              options: {
                sourceMap: isDev(argv.mode)
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: getPlugins(argv.mode),
  devServer: { inline: true, port: 3000 }
});

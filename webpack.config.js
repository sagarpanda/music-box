const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PUB_DIR = path.resolve(__dirname, 'public');
const SRC_DIR = path.resolve(__dirname, 'src');

function isDev() {
  return process.env.NODE_ENV === 'development';
}

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function getPlugins() {
  let plugins = [
    new ExtractTextPlugin('styles.css')
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    // new HtmlWebpackPlugin({ template: 'template.html' })
  ];
  if (isProd()) {
    plugins = plugins.concat([new UglifyJsPlugin()]);
  }
  return plugins;
}

const config = {
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
                sourceMap: isDev()
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
                sourceMap: isDev()
              }
            },
            {
              loader: 'scss-loader',
              options: {
                sourceMap: isDev()
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
              limit: 8192,
              prefix: 'zz'
            }
          }
        ]
      }
    ]
  },
  plugins: getPlugins(),
  devServer: { inline: true, port: 3000 }
};

module.exports = config;

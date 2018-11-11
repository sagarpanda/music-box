const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
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
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: isDev(argv.mode)
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev(argv.mode)
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              sourceMap: isDev(argv.mode)
            }
          }
        ]
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

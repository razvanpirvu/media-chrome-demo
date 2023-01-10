const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const customStyleLoader = {
  loader: 'style-loader',
  options: {
    insert: function (linkTag) {
      const parent = document.querySelector('azure-video-player').shadowRoot
      parent.appendChild(linkTag)
    },
  },
}


module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-typescript"],
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // customStyleLoader,
          'css-loader',
          'sass-loader'
        ],
      },
      
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    static: "./dist",
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};

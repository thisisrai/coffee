const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const production = env.production === "true";

  const main = {
    mode: "production",
    entry: "./src/index.jsx",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "build"),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.m?\js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "@babel/plugin-transform-runtime",
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(mp4|webm|ogg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'videos',
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "My React Project",
        template: "./src/index.html",
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  };

  const dev = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dev"),
      },
      port: process.env.PORT,
    },
  };

  return production ? main : { ...main, ...dev };
};
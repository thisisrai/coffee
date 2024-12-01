const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const isProduction = env.production === true;

  return {
    entry: "./src/index.jsx",
    output: {
      path: path.resolve(__dirname, "build"), // Changed from 'dist' to 'build'
      filename: "bundle.[contenthash].js",
      publicPath: "/",
    },
    mode: isProduction ? "production" : "development",
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
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      port: process.env.PORT || 3000,
      static: {
        directory: path.join(__dirname, "public"),
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ],
  };
};

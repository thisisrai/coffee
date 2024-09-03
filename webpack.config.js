const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const production = env.production === "true";

  const main = {
    mode: production ? "production" : "development",
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
          test: /\.m?js$/,
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
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "My React Project",
        template: "./public/index.html",
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  };

  const dev = {
    devtool: "inline-source-map",
    devServer: {
      static: {
        directory: path.resolve(__dirname, "public"), // Serve files from the public directory
      },
      port: process.env.PORT || 4000,
    },
  };

  return production ? main : { ...main, ...dev };
};

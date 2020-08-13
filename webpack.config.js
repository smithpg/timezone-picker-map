const path = require("path");
const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(s[ac]ss)$/,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist/"),
  },
  plugins: [new webpack.HotModuleReplacementPlugin({ multistep: true })],
  devServer: {
    contentBase: path.join(__dirname, "dist/"),
    watchContentBase: true,
    port: 9000,
    hot: true,
  },
};

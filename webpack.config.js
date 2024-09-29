const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    contentScript: "./src/contentScript.js",
    background: "./src/background.js",
    noicePanel: "./src/noicePanel.js", // Add the popup entry
    hover: "./src/hover.js", // Add the hover entry
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/index.html", // Copy popup.html to dist
          to: "index.html",
        },
        {
          from: "src/styles.css", // Copy styles.css to dist
          to: "styles.css",
        },
        {
          from: "./icons/*.png",
          to: path.resolve(__dirname, "dist/icons/[name][ext]"),
          context: "src",
        },
        {
          from: "src/manifest.json",
          to: path.resolve(__dirname, "dist/manifest.json"),
        },
        {
          from: "src/adhoc.png",
          to: path.resolve(__dirname, "dist/adhoc.png"),
        },
      ],
    }),
  ],
};

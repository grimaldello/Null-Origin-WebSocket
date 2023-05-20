const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./lib/esm/index.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./lib/umd"),
    filename: 'index.js',
    library: "NullOriginWebSocket",   // webpack exposes the library as a global, NullOriginWebSocket
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "this"
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};

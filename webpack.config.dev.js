const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require("./webpack.config.common");

const dev = {

    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map"
};

module.exports = merge(common, dev);

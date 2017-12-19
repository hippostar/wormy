const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require("./webpack.config.common");

const dev = {

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
};

module.exports = merge(common, dev);

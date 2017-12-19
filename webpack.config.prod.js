const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require("./webpack.config.common");

const prod = {

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
};

module.exports = merge(common, prod);

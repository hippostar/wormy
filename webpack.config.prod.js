const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require("./webpack.config.common");

const prod = {
    mode: "production"
};

module.exports = merge(common, prod);

var path = require("path");
var fs = require("fs");
const webpack = require('webpack');

var entryFolder = "./source/entry";
var files = fs.readdirSync(entryFolder); console.log(files);
var entry = {};
files.map(file => entry[file] = path.resolve(entryFolder, file));
console.log(entry)

module.exports = {
    entry,

    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name]"
    },

    module: {
        rules: [
            {
                test: /\.jsx$/,
                loader: "babel"
            }
        ]
    },
    devtool: "eval",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: true
        })
    ],
};


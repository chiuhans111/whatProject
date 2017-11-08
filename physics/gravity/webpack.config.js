var path = require("path");
var webpack = require("webpack")
module.exports = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, ''),
        publicPath: "/",
        filename: "./m.js"
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    plugins: [
        // ...
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
};
var path = require("path");
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
    }
};
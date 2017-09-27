var path = require('path')
var webpack = require('webpack')
var fs = require('fs');


var entryFolder = './source/';
var outputFolder = path.resolve(__dirname, './dist');
var publicFolder = path.resolve(__dirname, './dist');
console.log('webpack target in:', entryFolder, 'out:', outputFolder);
var targets = fs.readdirSync(entryFolder).filter(x => x.match(/\.js$/));
console.log('found:', targets.join(','));
var entry = {};
for (var file of targets) entry[file] = entryFolder + file;
console.log(entry);

module.exports = {


    // This is the "main" file which should include all other modules
    entry,
    // Where should the compiled file go?
    output: {
        // To the `dist` folder 
        path: outputFolder,
        publicPath: 'http://localhost:8080/dist/',
        // With the filename `build.js` so it's dist/build.js
        filename: '[name]'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        //historyApiFallback: true,
        noInfo: true,
        contentBase: publicFolder,
        proxy: {
            '/api': {
                target: 'http://localhost:80/',
                secure: false
            }
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}

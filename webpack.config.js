const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtactPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const path = require('path')

const BaseConfig = {
    entry: ['jquery'],
    output: {
        filename: 'js/[name].[hash].js'
    },
    devServer: {
        port: 9090,
        hot: true,
        historyApiFallback: {
            rewrites: [
                {
                    from: /^\/([a-zA-Z0-9]+)/, // /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/
                    to: function (context) {
                        console.log(context.match[1] + '.html', context.match[1] + context.match[2] + '.html')
                        return '/' + context.match[1] + '.html'
                    }
                }
            ]
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtactPlugin.loader,
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssExtactPlugin.loader,
                    {
                        loader: 'css-loader',
                        // options: {
                        //     modules: true,
                        //     // 自定义生成的类名
                        //     localIdentName: '[local]_[hash:base64:8]'
                        // }
                    },
                    'stylus-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.(jpge?|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        name: '[name]-[hash:8]' + '.[ext]',
                        outputPath: 'assets/imgs'
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src', 'img:data-src']
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            name: true,
            minSize: 10,
            cacheGroups: {
                jquery: {
                    test: /jquery/,
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new MiniCssExtactPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
        new webpack.NamedChunksPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
const generatePage = function ({
    entry = '',
    title = '',
    name = '',
    template = './src/index.html',
    chunks = []
} = {}) {
    return {
        entry,
        plugins: [
            new HtmlWebpackPlugin({
                chunks,
                template,
                filename: name + '.html'
            })
        ]
    }
}

const pages = [
    generatePage({
        name: 'a',
        entry: {
            modalA: './src/pages/ModalA/index'
        },
        title: 'ModalA',
        template: './src/pages/ModalA/index.html',
        chunks: ['modalA']
    }),
    generatePage({
        name: 'b',
        entry: {
            modalB: './src/pages/ModalB/index'
        },
        title: 'ModalB',
        template: './src/pages/ModalB/index.html',
        chunks: ['modalB']
    })
]
console.log(pages.map(page => merge(BaseConfig, page)))
module.exports = pages.map(page => merge(BaseConfig, page))
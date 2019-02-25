#### Webpack 多页面应用

#### 安装 Webpack

最新的webpack版本是 v4.29.5

安装命令
```
npm install --save-dev webpack
```
如果你使用 webpack 4+ 版本，你还需要安装 CLI
```
npm install --save-dev webpack-cli
```

#### npm 初始化项目
 ```
    npm init 创建 package.json
 ```

#### 创业项目目录结构
app
--src
----assets
------imgs
----pages
----static
--webpack.config.js
--package.json

#### 创建 webpack.config.js
根目录创建 webpack.config.js
引入本次需要的文件
```
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtactPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const path = require('path')

```
创建BaseConfig,多页面基础配置
```
const BaseConfig = {
    entry: ['jquery'], // 第三方
    output: { // 输出文件路径
        filename: 'js/[name].[hash].js'
    },
    devServer: { // webpack-dev-server 配置
        port: 9090,
        hot: true,
        historyApiFallback: {
            rewrites: [ // 路径重定向
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
    module: { // css-loader 、 stylus-loader 、babel-loader、url-loader、 html-loader
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
                        loader: 'css-loader'
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
        new MiniCssExtactPlugin({ // 提取公共css插件
            filename: 'css/[name].[hash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
        new webpack.NamedChunksPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
创建页面生产函数
```
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
```
批量处理多页面
```
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
```
webpack-merge 并导出
```
module.exports = pages.map(page => merge(BaseConfig, page))
```

#### 创建页面，在pages 中创建 ModalA ,ModalB文件夹，并分别在其中创建 index.html index.js结构如下
pages
--ModalA
----index.js
----index.html
--ModalB
----index.js
----index.html
static
--css
----ModalA.styl
----ModalB.styl

ModalA.html Pc项目中引入Vue
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
</head>
<body>
    <img src="../../assets/imgs/elephant.png" data-src="../../assets/imgs/elephant.png" alt="">
    <div id="app" class="ModalA">
        {{ message }}
    </div>
</body>
</html>
```
ModalA/index.js
```
import '../../static/stylus/ModalA.styl'

var app = new Vue({
    el: '#app',
    data: function() {
        return {
            message: 'Hello ModalA'
        }
    }
})

```

#### webpack modules 

#### 如何运行项目 webpack-dev-server



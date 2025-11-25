const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ELECTRON_VERSION = require('./package.json').devDependencies.electron;

module.exports = {
    // The renderer code rus in BrowserWindow without node support so we must
    // target a web platform.
    target: 'web',
    entry: { app: './app/index.js' },
    performance: {
        maxAssetSize: 1.5 * 1024 * 1024,
        maxEntrypointSize: 1.5 * 1024 * 1024
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html'
        })
    ],
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    node: {
        __dirname: true
    },
    module: {
        noParse: /external_api\\.js/,
        rules: [
            {
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        [
                            require.resolve('@babel/preset-env'),
                            {
                                modules: false,
                                targets: {
                                    electron: ELECTRON_VERSION
                                }
                            }
                        ],
                        require.resolve('@babel/preset-react')
                    ],
                    plugins: [
                        require.resolve('@babel/plugin-proposal-class-properties'),
                        require.resolve('@babel/plugin-proposal-export-namespace-from')
                    ]
                },
                test: /\.js$/
            },
            {
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ],
                test: /\.css$/
            },
            // 【修改点】替换原有的 file-loader (只支持png)，改为 asset/resource 以支持多种图片格式
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                use: [ {
                    loader: '@svgr/webpack',
                    options: {
                        dimensions: false,
                        expandProps: 'start'
                    }
                } ]
            }
        ]
    },
    externals: [ {
        '@jitsi/electron-sdk': 'require(\'@jitsi/electron-sdk\')'
    } ],
    resolve: {
        modules: [
            path.resolve('./node_modules')
        ]
    }
};


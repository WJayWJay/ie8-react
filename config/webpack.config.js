const path = require('path');
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const ROOT_PATH = path.resolve(__dirname, '../');
const DIST = path.resolve(ROOT_PATH, './dist');

const isProd = ['prod', 'production'].includes(process.env.NODE_ENV);

const config = {
    // context: path.resolve(__dirname, '../'),
    devtool: isProd ? 'cheap-module-source-map' : 'source-map',
    entry: './src/main.js',
    output: {
        path: DIST,
        filename: 'js/[name].[hash].js',
        publicPath: '/',
        chunkFilename: 'js/[name].[hash].js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            react: 'anujs/dist/ReactIE.js',
            'react-dom': 'anujs/dist/ReactIE.js',
            'prop-types': 'anujs/lib/ReactPropTypes',
            devtools: 'anujs/lib/devtools',
            'create-react-class': 'anujs/lib/createClass',
            router: "anujs/dist/Router.js",
            rematch: "anujs/dist/Rematch.js",
            "@": path.resolve(__dirname, '../src/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                'env',
                                {
                                    targets: {
                                        browsers: ['last 2 versions', 'ie >= 7'],
                                    },
                                    modules: 'commonjs',
                                    useBuiltIns: true,
                                    debug: false,
                                },
                            ],
                            'react',
                            'stage-2',
                        ],
                        plugins: ['transform-runtime'],
                    },
                },
                include: [path.resolve(__dirname, '../src')],
            },
            {
                test: /\.((css)|(less))$/,
                include: [path.resolve(__dirname, '../src')],
                use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader', 'less-loader'],
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100,
                            name: 'asset/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    mode: isProd ? 'production':'development',
    plugins: [
        new es3ifyPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/templete/index.ejs'),
            inject: 'body',
            hase: false,
            minify: {
                // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: false, // 删除空白符与换行符
            },
            // chunks: ['production'],
        }),
    ],
};

if (!isProd) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
    config.plugins.push(
        new CleanWebpackPlugin("dist", {root: ROOT_PATH})
    );
}


module.exports = config;
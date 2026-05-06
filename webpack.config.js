const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        chunkFilename: '[name].bundle.js', // Import dinamico genera bundle separati
        libraryTarget: 'commonjs2',
        sourceMapFilename: '[file].map',
    },
    mode: 'development',
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    externals: [
        nodeExternals(),
        {
            react: 'react',
            'react-dom': 'react-dom',
            'react-router-dom': 'react-router-dom',
            firebase: 'firebase'
        }
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: { loader: 'ts-loader' },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'index.css' }),
    ],
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
        clean: true,
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : false,
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 3000,
        historyApiFallback: true,
        hot: true,
        open: false,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: { transpileOnly: true },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        // Force all react/router requires to resolve from the showcase's node_modules.
        // Without this, webpack follows the library's dist/ path and finds the library's
        // own copies (installed as devDeps), creating two React instances.
        alias: {
            'react':                   path.resolve(__dirname, 'node_modules/react'),
            'react-dom':               path.resolve(__dirname, 'node_modules/react-dom'),
            'react-router-dom':        path.resolve(__dirname, 'node_modules/react-router-dom'),
            // Pin icon libs to their ESM builds to avoid the "exports is not defined" error
            // that occurs because @phosphor-icons/react declares "type":"module" but its
            // "main" entry is a CJS file — webpack 5 then treats the CJS file as ESM.
            'lucide-react':            path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/lucide-react.mjs'),
            '@phosphor-icons/react':   path.resolve(__dirname, 'node_modules/@phosphor-icons/react/dist/index.es.js'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(
                Object.fromEntries(
                    Object.entries(process.env).filter(([k]) => k.startsWith('REACT_APP_'))
                )
            ),
        }),
    ],
};

// Generated using webpack-cli http://github.com/webpack-cli
const path = require('path');

const {
    NODE_ENV = 'production',
  } = process.env;

module.exports = {
    watch: true,
    mode: 'development',
    entry: './src/server/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, './../../dist'),
        // clean: true
    },
    devServer: {
        open: true,
        host: 'localhost'
    },
    plugins: [
        // Add your plugins here
        // Learn more obout plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
                use: ['file-loader'],
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
};

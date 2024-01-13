import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { generateHeader } from "../plugins/userscript.plugin";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InsertContentPlugin = require('../plugins/insertCss.plugin');

const config: any = {
    entry: "./src/index.ts",
    target: "web",
    resolve: {
        extensions: [".ts", ".js", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.m?tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    externals: {
        axios: "axios",
        "@trim21/gm-fetch": "GM_fetch",
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            terserOptions: {
                format: {
                    comments: false,
                },
                compress: false,
                mangle: false,
            },
            extractComments: false,
        })],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: generateHeader,
            raw: true,
            test:/\.js$/i
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        // new InsertContentPlugin(path.resolve(__dirname,'..','userscripts/style.css'), '// $$#css#$$')
        new InsertContentPlugin('// $$#css#$$')
    ]
};

export default config;
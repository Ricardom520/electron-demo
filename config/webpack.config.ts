import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { loaderRegax } from './const'
import path from 'path'
import { entries } from './func'
const CopyWebpackPlugin = require('../plugins/copyWebpackPlugin')

const isDev = process.env.NODE_ENV === 'development'

const { entry, htmlWebpackPlugin } = entries()

const common: Configuration = {
  mode: isDev ? 'development' : 'production',
  externals: [
    'fsevents',
    {
      sqlite3: 'commonjs sqlite3'
    }
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src/web')
    }
  },
  output: {
    publicPath: './',
    assetModuleFilename: 'assets/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: loaderRegax.lessRegex,
        exclude: loaderRegax.lessModuleRegex,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 3,
              sourceMap: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: loaderRegax.lessModuleRegex,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(ico|png|jpg|svg|eot|woff?2?)$/,
        type: 'asset/resource'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        exclude: /node_modules/
      },
      {
        test: /\.cs$/i,
        loader: 'file-loader',
        exclude: /node_modules/
      }
    ]
  },
  watch: isDev,
  devtool: isDev ? 'source-map' : undefined
}

const main: Configuration = {
  ...common,
  target: 'electron-main',
  entry: {
    main: './src/main.ts'
  }
}

const preload: Configuration = {
  ...common,
  target: 'electron-preload',
  entry: {
    preload: './src/preload.ts'
  }
}

const renderer: Configuration = {
  ...common,
  target: 'web',
  // entry: entry,
  entry: {
    index: './src/web/index.tsx',
    loading: './src/web/loading.tsx',
    update: './src/web/update.tsx'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new HtmlWebpackPlugin( {
    //   inject: "body",
    //   template: "./src/web/index.html",
    // }),
    new CopyWebpackPlugin({
      from: '/src/assets',
      to: 'assets'
    })
  ].concat(htmlWebpackPlugin)
}

export default [main, preload, renderer]

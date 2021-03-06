/**
 * Created by tushar.mathur on 03/08/16.
 */

'use strict'

import path from 'path'
import webpack from 'webpack'
import {ApplicationShell} from '../pre-render/AppShellPlugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

/**
 * Loaders
 */
const imgLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'file?hash=sha512&digest=hex&name=[hash].[ext]',
    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
  ]
}
const babelLoader = {
  test: /.js$/,
  loader: 'babel',
  exclude: /node_modules/
}

/**
 * Base config
 */
export default {
  entry: {
    client: './src/web-components/index.js',
    sw: './src/sw.js',
    manifest: 'file?name=manifest.json!./src/manifest.json'
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
    filename: '[chunkhash].[name].js'
  },
  devServer: {contentBase: './public'},
  plugins: [
    new ApplicationShell(),
    new webpack.DefinePlugin({APP_CONFIG: JSON.stringify(APP_CONFIG)}),
    new CopyWebpackPlugin([
      {from: '*.png', context: './src/icons'}
    ])
  ],
  module: {
    loaders: [imgLoader, babelLoader]
  }
}

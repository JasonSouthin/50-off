const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const development = {
  entry: {
      shop: './src/controllers/shop/index.js',
      notFound: './src/controllers/page-not-found/index.js',
      entry: './src/controllers/entry/index.js',
      cart: './src/controllers/shop/cart/index.js',
      checkout: './src/controllers/shop/checkout/index.js',
      productDetail: './src/controllers/shop/product-detail/index.js',
      productIndex: './src/controllers/shop/index/index.js',
      admin: './src/controllers/admin/index.js',
      editProduct: './src/controllers/admin/edit-product/index.js',
      adminProducts: './src/controllers/admin/products/index.js',
      orders: './src/controllers/shop/orders/index.js',
      login: './src/controllers/auth/index.js',
      signup: './src/controllers/auth/signup/index.js',
      reset: './src/controllers/auth/reset/index.js',
      newPass: './src/controllers/auth/new-password/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new CopyPlugin([
        { from: './src/manifest.json' },
        { from: './src/controllers/includes/*'},
        { from: './src/static/**'}
        // { from: './src/controllers/server/sw.js' }
      ]),
      new CompressionPlugin(),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/index.ejs",
        filename: "./index.ejs",
        excludeChunks: ['server'],
        chunksSortMode: 'auto',
        chunks: ['vendors', 'entry', 'shop', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/page-not-found/404.ejs",
        filename: "./404.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'notFound', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/page-not-found/500.ejs",
        filename: "./500.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'notFound', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/cart/index.ejs",
        filename: "./cart.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'cart', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/checkout/index.ejs",
        filename: "./checkout.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'checkout', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/product-detail/index.ejs",
        filename: "./product-detail.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'productDetail', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/index/index.ejs",
        filename: "./product-index.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'productIndex', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/admin/index.ejs",
        filename: "./admin.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'admin', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/admin/products/index.ejs",
        filename: "./admin-products.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'adminProducts', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/admin/edit-product/index.ejs",
        filename: "./edit-product.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'editProduct', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/shop/orders/index.ejs",
        filename: "./orders.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'orders', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/auth/index.ejs",
        filename: "./login.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'login', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/auth/signup/index.ejs",
        filename: "./signup.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'signup', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/auth/reset/index.ejs",
        filename: "./reset.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'reset', 'runtime']
      }),
      new HtmlWebPackPlugin({
        template: "./src/controllers/auth/new-password/index.ejs",
        filename: "./new-password.ejs",
        inject: true,
        excludeChunks: ['server'],
        chunksSortMode: 'none',
        chunks: ['vendors', 'entry', 'newPass', 'runtime']
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    //   new WorkboxPlugin.GenerateSW({
    //     clientsClaim: true,
    //     skipWaiting: true
    //     }),
        new WorkboxPlugin.InjectManifest({
            swSrc: path.join(process.cwd(), '/src/controllers/server/sw.js'),
            swDest: 'sw.js',
            exclude: [/\.(?:png|jpg|jpeg|svg)$/]
            // runtimeCaching: [{
            //     urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            //     handler: 'CacheFirst',
            //     options: {
            //         cacheName: 'images',
            //         expiration: {
            //             maxEntries: 10,
            //         }
            //     }
            // }]
          })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
        {
            test: /\.ejs$/,
            use: [
                {
                loader: "ejs-webpack-loader",
                options: {
                    htmlmin: true
                }
                }
            ]
        },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: [{
            loader: "file-loader"
        }]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery'
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
    ]
  },
  optimization: {
      moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [
        new OptimizeCssAssetsPlugin({})
    ]
  }
};

const server = {
    entry: {
        server: path.join(__dirname, '/src/controllers/server/server.js')
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].js'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [ nodeExternals() ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.marko$/,
                loader: "@marko/webpack/loader"
            }
        ],
    }
}

module.exports = (env, argv) => { 
    if(argv.server){ 
        return server
    }

    if(argv.mode === 'production'){
        return production
    }

    return development
} ;

const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/index.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/js/',
        filename: `[name].js`,
    },
    module: {
      rules: [
        {
            test: /\.css$/,
            loaders: [
                'style-loader',
                'css-loader',
            ]
        },
        {
          test: /\.tsx$/,
          use: 'ts-loader',
        },
        {
            test: /\.ts$/,
            use: 'ts-loader',
          },
  
      ],
    },
    resolve: {
      // 拡張子を配列で指定
      extensions: [
        '.ts', '.tsx', '.js',
      ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        port: 8080,
        host: 'localhost'
        // historyApiFallback: true, // これがないとルーティングできない
    },
  };
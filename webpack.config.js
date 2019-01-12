const path = require('path');


module.exports = (env, options) => {

  const min = options.mode === 'production' ? '.min' : '';

  return {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname) + '/dist',
      libraryTarget: "umd",
      filename: `react-axios-connect${min}.js`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    resolve: {
      alias: {
        'axios': path.resolve(__dirname, './node_modules/axios'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      }
    },
    externals: {
      // Don't bundle axio,react and react-dom      
      axios: {
        commonjs: "axios",
        commonjs2: "axios",
        amd: "Axios",
        root: "Axios"
      },
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "React",
        root: "React"
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "ReactDOM",
        root: "ReactDOM"
      }
    }
  }
};

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('../config/webpack.config');
const config = require('../config/config');


const devServerOptions = Object.assign({}, {
    stats: {
      colors: true,
    },
    contentBase: '../dist',
    publicPath: '/',
    progress: true,
    inline: true,
    hot: true,
    noInfo: false,
  }, config);
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);

  const compiler = webpack(webpackConfig);

  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(config.port, config.host, () => {
    console.log('server starting on http://localhost:' + config.port);
  });
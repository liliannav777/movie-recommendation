const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('define').use(webpack.DefinePlugin, [{
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true)
    }]);
  },
  devServer: {
    port: 8080,
  },
});

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  /* webpack-dev-server 相关配置 */
  devServer: {
    /* 自动打开浏览器 */
    open: false,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    host: '0.0.0.0',
    port: 8081,
    https: false,
    /* 使用代理 */
    proxy: {
      '/oss': {
        target: 'http://127.0.0.1:10000/',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/oss': ''
        }
      },
      '/': {
        target: 'http://127.0.0.1:9000/', //后端地址
        secure: false,  // 如果是https接口，需要配置这个参数
        ws: true,//是否代理websockets
        changeOrigin: true,
      },
    }
  },
})


// vue.config.js

module.exports = {
  // 选项
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0', // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    proxy: {//跨域时开启
      '/api': {
        // target: 'http://localhost:3000',//本地测试
        target: 'http://node.nico33.icu',//线上部署
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/app': {
        target: 'https://www.nico33.icu/index.php/Home/Index',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          '^/app': ''
        }
      }
    } // 代理转发配置，用于调试环境
  },

}
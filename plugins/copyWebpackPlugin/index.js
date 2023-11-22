const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const { validate } = require('schema-utils')
const globby = require('./globby')
const schema = require('./schema.json')
const { RawSource } = webpack.sources

class CopyWebpackPlugin {
  constructor(options = {}) {
    validate(schema, options, {
      name: 'CopyWebpackPlugin'
    })

    this.options = options
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
      // 添加资源的hooks
      compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async (callback) => {
        // 把form的资源复制到to中
        const { from, ignore } = this.options
        // 补齐
        const to = this.options.to || '.'
        // 获取运行指令的目录
        const context = compiler.options.context
        // 将输入路径变成绝对路径
        const absoluteForm = path.isAbsolute(from) ? from : path.join(context, from)
        // globby(要处理的文件夹)，第二个参数是忽略的文件
        const paths = await globby(absoluteForm, { ignore })
        console.log('paths:', paths)
        // 读取文件内容
        const files = await Promise.all(
          paths.map(async (file_info) => {
            const { file_path, file_name } = file_info
            const file_data = await fs.readFileSync(file_path)
            const filename = path.join(to, file_name)
            return {
              file_data,
              filename
            }
          })
        )
        // 生成webpack资源
        const assets = files.map((file) => {
          const { file_data, filename } = file
          const source = new RawSource(file_data)

          return {
            source,
            filename
          }
        })
        // 添加到compilation输出出去
        assets.forEach((asset) => {
          const { filename, source } = asset
          compilation.emitAsset(filename, source)
        })
        // 插件执行完毕
        callback()
      })
    })
  }
}

module.exports = CopyWebpackPlugin

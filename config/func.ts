import HtmlWebpackPlugin from 'html-webpack-plugin'
import fs from 'fs'
import path from 'path'

export function entries() {
  const pagesPath = path.resolve(__dirname, '../src/html/pages')
  const layoutPath = path.resolve(__dirname, '../src/html/layout')
  const files = fs.readdirSync(pagesPath)
  const htmlWebpackPlugin = []
  const entry: Record<string, string> = {}

  for (let i = 0; i < files.length; i++) {
    const content = JSON.parse(fs.readFileSync(pagesPath + '/' + files[i]).toString())
    const outputHtml = path.resolve(layoutPath, content.layout)
    const filename = files[i].split('.')[0]

    entry[filename] = path.resolve(__dirname, `../src/web/${filename}.tsx`)
    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: outputHtml,
        inject: 'body',
        chunks: [filename],
        defer: true,
        filename: `${filename}.html`
      })
    )
  }

  return { entry, htmlWebpackPlugin }
}

const fs = require('fs')
const path = require('path')

async function globby(absoluteForm, options) {
  const { ignore = [] } = options
  absoluteForm = absoluteForm.indexOf('/') === 0 ? absoluteForm.substring(1) : absoluteForm
  console.log('===============')
  console.log('absoluteForm:', await fs.readdirSync(absoluteForm))
  try {
    const result = await fs.readdirSync(absoluteForm)
      .filter(filte => !ignore.includes(filte))
      .map(file => {
        return {
          file_path: path.join(absoluteForm, file),
          file_name: file
        }
      })

      return result || []
  } catch (err) {
    console.error(err)
  }
}

module.exports = globby
const Option = require('../Option')

module.exports = class ClientDynamicModulesOption extends Option {
  async apply (context) {
    for (const item of this.items) {
      const { value: fn, name: pluginName } = item
      let modules = await fn()
      if (!Array.isArray(modules)) {
        modules = [modules]
      }
      for (const { name, content, dirname } of modules) {
        await context.writeTemp(
          `${dirname || 'dynamic'}/${name}`,
          `
/**
 * Generated by "${pluginName}"
 */
${content}\n\n
        `.trim())
      }
    }
  }
}
const cookie = require('tiny-cookie')

const vueCookie = {
  // Main functions
  get: (name) => cookie.get(name),
  set: (name, value, options) => cookie.set(name, value, options),
  remove: (name, options) => cookie.remove(name, options),

  // More functions
  delete: (name, options) => cookie.remove(name, options), // alias of remove
  getAll: () => cookie.getAll()
}

export default (app) => {
  app.config.globalProperties.$cookie = vueCookie
}

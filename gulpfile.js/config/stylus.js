var config = require('./')

module.exports = {
  autoprefixer: { browsers: ['last 2 version'] },
  src: config.sourceAssets + "/stylesheets/**/*.styl",
  dest: config.publicAssets + '/stylesheets',
  settings: {

  }
}

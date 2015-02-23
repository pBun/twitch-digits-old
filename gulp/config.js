var dest = "./build";
var src = './src';

module.exports = {
  dest: dest,
  src: src,
  autoprefixer: {
    browsers: ['last 2 versions'],
    cascade: false
  },
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + "/**",
      // Exclude Map files
      "!" + dest + "/**.map"
    ]
  },
  css: {
    src: src + "/styles/*.css",
    dest: dest
  },
  stylus: {
    src: [src + "/styles/*.styl", '!' + src + '/styles/_*.styl'],
    dest: dest
  },
  sass: {
    src: src + "/styles/*.{sass,scss}",
    dest: dest,
    settings: {
      // Required if you want to use SASS syntax
      // See https://github.com/dlmanning/gulp-sass/issues/81
      sourceComments: 'map',
      imagePath: '/images' // Used by the image-url helper
    }
  },
  assets: {
    src: [src + '/assets/**', '!' + src + '/assets/{images,images/**}'],
    dest: dest + "/assets"
  },
  images: {
    src: src + "/assets/images/**",
    dest: dest + "/assets/images"
  },
  markup: {
    src: src + "/htdocs/**",
    dest: dest
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.js', '.hbs'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/javascript/app.js',
      dest: dest,
      outputName: 'app.js'
    }, {
      entries: src + '/javascript/head.js',
      dest: dest,
      outputName: 'head.js'
    }]
  }
};

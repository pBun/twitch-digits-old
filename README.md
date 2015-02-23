gulp-starter
============

Starter Gulp + Browserify project with examples of how to accomplish some common tasks and workflows. This is a rework of [greypants' gulp-starter](https://github.com/greypants/gulp-starter).

Includes the following tools, tasks, and workflows:

- [Browserify](http://browserify.org/) (with [browserify-shim](https://github.com/thlorenz/browserify-shim))
- [Watchify](https://github.com/substack/watchify) (caching version of browserify for super fast rebuilds)
- [Stylus](http://learnboost.github.io/stylus/) / [SASS](http://sass-lang.com/) + [Compass](http://compass-style.org/) / CSS (with source maps ([sass](https://github.com/sindresorhus/gulp-ruby-sass#sourcemap)), and [auto-prefixer](https://github.com/sindresorhus/gulp-autoprefixer)!)
- [Angular](http://angular.com/) (from npm)
- [BrowserSync](http://browsersync.io) for live reloading and a static server
- Production build task (with minification ([css](https://github.com/jonathanepollack/gulp-minify-css) / [js](https://github.com/terinjokes/gulp-uglify)) and [connect](https://github.com/avevlad/gulp-connect) for easy Heroku/Dokku pushes!)
- Image optimization
- Error Notifications in Notification Center
- Non common-js vendor code (like a jQuery plugin)

If you've never used Node or npm before, you'll need to install Node.
If you use homebrew, do:

```
brew install node
```

Otherwise, you can download and install from [here](http://nodejs.org/download/).

### Install Gulp Globally

Gulp must be installed globally in order to use the command line tools. *You may need to use `sudo`*


```
npm install -g gulp
```

Alternatively, you can run the version of gulp installed local to the project instead with


```
./node_modules/.bin/gulp
```

### Install Sass and Compass (if you haven't already and plan on using it)


The gulp-compass module relies on Compass already being installed on your system.

If you have bundler installed, simply run bundle to install dependencies from the `Gemfile`


```
bundle
```

Otherwise,


```
gem install sass
gem install compass --pre
```

### Install npm dependencies

```
npm install
```

This runs through all dependencies listed in `package.json` and downloads them
to a `node_modules` folder in your project directory.

### Run gulp and be amazed.

```
gulp
```

This will run the `default` gulp task defined in `gulp/tasks/default.js`, which does the following:
- Run 'watch', which has 2 task dependencies, `['setWatch', 'browserSync']`
- `setWatch` sets a variable that tells the browserify task whether or not to use watchify.
- `browserSync` has `build` as a task dependecy, so that all your assets will be processed before browserSync tries to serve them to you in the browser.
- `build` includes the following tasks: `['browserify', 'stylus', 'images', 'markup']`

### Configuration
All paths and plugin settings have been abstracted into a centralized config object in `gulp/config.js`. Adapt the paths and settings to the structure and needs of your project.

twitch digits
============

An [AngularJS](https://angularjs.org/) app to display the [Twitch.tv](http://twitch.tv) viewer spread across games and streams with [d3.js](http://d3js.org). This project borrows heavily from [kerryrodden's zoomable sunburst example](http://bl.ocks.org/kerryrodden/477c1bfb081b783f80ad).

## Local development

If you've never used Node or npm before, you'll need to install Node.
If you use homebrew, do:

```
brew install node
```

Otherwise, you can download and install from [here](http://nodejs.org/download/).

#### Install Gulp Globally

Gulp must be installed globally in order to use the command line tools. *You may need to use `sudo`*


```
npm install -g gulp
```

Alternatively, you can run the version of gulp installed local to the project instead with


```
./node_modules/.bin/gulp
```

#### Install npm dependencies

```
npm install
```

This runs through all dependencies listed in `package.json` and downloads them
to a `node_modules` folder in your project directory.

#### Run gulp.

```
gulp
```

or

```
gulp production
```



# ProTradeIonic
## About
This is a yeoman `ionic-gulp` project
## Install
it depends `bower` and `gulp`. So we should first install them in **global**.

```shell
$ sudo npm i -d -g bower
$ sudo npm i -d -g gulp
```

And then in `ProTradeIonic` directory, install package from `package.json` and `bower.json`,so just run below command:

```shell
$ npm i
$ bower i
```

if run "npm i" failed，maybe the Chinese network is not well，you can install a cnpm：

```shell
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```
it used like npm and it just add "c" in front of the "npm"

```shell
$ cnpm install [name]
```

## Build mode

By running just `gulp --build` or short `gulp -b`, we start gulp in build mode

- concat all `.js` sources into single `app.js` file
- version `main.css` and `app.js`
- build everything into `www`
- remove debugs messages such as `console.log` or `alert` with passing `--release`


## Emulate

By running `gulp -e <platform>`, we can run our app in the simulator

- <platform> can be either `ios` or `android`, defaults to `ios`
- make sure to have iOS Simulator installed in XCode, as well as `ios-sim` package globally installed (`npm install -g ios-sim`)
- for Android, [Ripple](http://ripple.incubator.apache.org/) or [Genymotion](https://www.genymotion.com/) seem to be the emulators of choice
- It will run the `gulp --build` before, so we have a fresh version to test
- In iOS, it will livereload any code changes in iOS simulator

#### Emulate a specific iOS device

By running `gulp select` you will see a prompt where you can choose which ios device to emulate. This works only when you have the `gulp -e` task running in one terminal window and run `gulp select` in another terminal window.


## Run

By running `gulp -r <platform>`, we can run our app on a connected device

- <platform> can be either `ios` or `android`, defaults to `ios`
- It will run the `gulp --build` before, so we have a fresh version to test

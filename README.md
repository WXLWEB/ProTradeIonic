# ProTradeIonic
## About
This is a yeoman `ionic-gulp` project
## Install
it depends `bower` and `gulp`. So we should first install them in **global**.

```shell
$ sudo npm i -d -g bower
$ sudo npm i -d -g gulp
```
install ionic

```shell
$ sudo npm install -g cordova ionic
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

##Environment install

### Android Environment install
####install Android SDK

Install the SDK - This can be done a few different ways. 

1.The one is by installing [Android Studio](https://developer.android.com/sdk/installing/index.html?pkg=studio). This will let you install an editor that comes bundled with the Android SDK. So now our SDK is in our Applications Folder.


2.Another is by install [STAND-ALONE SDK TOOLS](https://developer.android.com/sdk/installing/index.html?pkg=tools). Then move this download to one specifiled path and check to this path

    ```shell
     tools/android
     ```
    and then install relatve build tools and api.

Edit .bash_profile - So if you’ve followed the steps above, you’ll need to edit your .bash_profile to include the following. If you didn’t install Android Studio, then no problem. You’ll just need to change the path to the SDK. You want to include the SDK tools and SDK Platform-tools.

```shell
 vim ~/.bash_profile 
 ```
 Installed Android Studio add this:
 ```shell
export PATH=${PATH}:/Applications/Android\ Studio.app/sdk/platform-tools:/Applications/Android\ Studio.app/sdk/tools
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=${JAVA_HOME}/bin:$PATH
export PATH=/usr/local/bin:$PATH
 ```
 Installed STAND-ALONE SDK TOOLS add this:
  ```shell
 export ANDROID_HOME=/Users/<your_computer_name>/<your_android_sdk_path>/android-sdk-macosx
  ```
 
 
##Run it 

run ios or android
```shell
$ ionic platform add ios/android
$ ionic build ios/android
$ ionic emulate ios/android
```

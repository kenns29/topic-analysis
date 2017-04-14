# Welcome to Our Team

This tutorial briefly describe how to get started on the project. I will cover the following topics:

* [Get the project](#git)
* [Things to Install](#install)
* [Things to Run](#run)
* [Access the database](#database)
* [Project Structure](#structure)
* [Things to Learn](#learn)
* [A little about MVC](#MVC)

## <a name = "git"></a>Get the project
In order to access and make updates to the project, we have to use git. If you are not familar with git, please check [https://git-scm.com/](https://git-scm.com/).

Our git server is located at [http://vaderserver0.cidse.dhcp.asu.edu:10000/](http://vaderserver0.cidse.dhcp.asu.edu:10000/).  Feel free to sign up with an user name and password, but please ask me for confirmation. Search for topic-analysis to find our project. You can get the project by

```
git clone http://vaderserver0.cidse.dhcp.asu.edu:10000/hxwang/topic-analysis.git
```

You will be asked for user name and password. You can avoid typing these everytime by uploading an SSH key. To find out how to do it, go to deploy key page in our git server, and make sure change the remote
by
```
git remote set-url origin ssh://gitlab@vaderserver0.cidse.dhcp.asu.edu:2323/hxwang/topic-analysis.git
```

Every new member should ask me for a developer access in order to make updates to the project. I recommand everyone to create an own branch.

## <a name = "install"></a>Things to install

In order to get started on the project, there are a few things you will have to install.
* [nodejs](#nodejs)
* [browserify](#browserify)
* [node-java](#node-java)

#### <a name = "nodejs"></a>nodejs
Our backend used nodejs, you can install it from [https://nodejs.org/](https://nodejs.org/).
#### <a name = "browserify"></a>browserify
Our frontend javascript is bundled using browserify, which is a nodejs library, you should learn more about it in [http://browserify.org/](http://browserify.org/).

To install browserify, you can do:

```
npm install -g browserify watchify
```

Note that **npm** is the package manager for nodejs, you should also be familiar with it. This command also installs **watchify**, which is a plugin for browserify, you can learn more about it in [https://github.com/substack/watchify](https://github.com/substack/watchify).
#### <a name = "node-java">node-java
Although we use nodejs primarily, we still have to use some java libraries for some NLP tasks, such as [StanfordCoreNLP](https://stanfordnlp.github.io/CoreNLP/) and [Mallet](http://mallet.cs.umass.edu/). To communicate between nodejs and java, we used the [node-java library](https://github.com/joeferner/node-java). You should try to get familar with it. Please use the module inside _java/java_init.js_ to load the library and the java codes.

You don't have to do it manually, becase I have included this command in our npm script (I will cover later). But if you really want, you can do
```
npm install java
```
**Important For Windows Users**

Installing the node-java library can be a bit tricky on windows. First you will need to have node-gyp installed
```
npm install -g node-gyp
```
But installing this requires you to have python and c++ compiler (usually the one comes with Visual Studio), so it may throw you an error if you don't have these installed. If you don't want to install all these manuallly, I suggest you use [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools). You can install this simply by:
```
npm install --global windows-build-tools
```
It will take a while.

**java codes**

I have wrapped up all the javacode inside _/jars/nlptoolkit.jar_. This file contained the precompiled java code from my other project [nlptoolkit](http://vaderserver0.cidse.dhcp.asu.edu:10000/hxwang/nlptoolkit). All it does is just wrapping up some NLP libraries, along with some helper functions. It also contains a slightly modifed Mallet library. Ask me for developer access if you think you need to add more functionalities on this code.

## <a name = "run"></a>Things to Run

#### Installing Dependencies

After all the necessary compoments are installed, you should run
```
npm install
```
It will install all necessary dependencies for our project. If you are not familar with npm. I suggest you take a look at our _package.json_ file. The _dependencies_ field describes all the node libraries we are using. If you want to install additional libraries, please do
```
npm install --save [library]
```
**Important:** the _--save_ options adds the library you installed to the _dependencies_ field. This is **very important** because it allow others to know which libraries you have used.

#### Building and Debugging

After installing all the dependencies, now please take a look at _scripts_ field in _package.json_. These are our **_npm scripts_**. Each can be executed by
```
npm run [command-name]
```

I will explain them one by one:

```json
"scripts": {
  "build-js": "browserify browser/js/main.js -o public/bundle.js -t [babelify --presets [es2015 async-to-generator async-generator-functions]]",
  "build": "npm run build-js & npm run build-css",
  "watch-js": "watchify browser/js/main.js -o public/bundle.js -dv",
  "watch": "npm run watch-js",
  "start": "node app.js",
  "build-css": "sass browser/css/main.scss:public/css/main.css --style compressed",
  "watch-css": "sass --watch browser/css/main.scss:public/css/main.css --style compressed"
}
```
**build-js** uses browserify to bundle our front-end javascript codes into _/public/bundle.js_.

**build-css** uses sass to bundle our css into _/public/css/main.css_.

**build** builds both javascript and css.

**watch-js** uses watchify to watch for any changes made to the front-end javascript code and update _/public/bundle.js_.

**watch-css** uses sass to watch for any changes made to the css and updates _/public/css/main.css_.

**watch** watchs the javascript.

**start** starts the back-end server which listens to port 10082.

Typically, during development, you want to open two terminal, one does ```npm run watch-js``` and the other does ```npm run watch-css```, this will make sure all changes you made to the front-end can take effect when you refresh the webpage. And you want to redo ```npm start``` everytime you made any changes to the backend.

## <a name = "structure"></a> Project Structure

The project may look like it has a lot of folders, but essentially, it has only a few major components:
```
browser/
  css/
  js/
public/
  css/
  bundle.js
  ...
views/
  index.ejs
  ...
app.js
package.json
... /* other modules and resources */
```


## <a name = "learn"></a>Things to Learn

## <a name = "mvc"></a>A little about MVC

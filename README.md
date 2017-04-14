# Welcome to Our Team

This tutorial briefly describe how to get started on the project. I will cover the following topics:

* [Get the project](#git)
* [Things to Install](#install)
* [Things to Run](#run)
* [Things to look](#learn)
* [Managing the Project](#manage)
* [Access the database](#database)
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

Note that npm is the package manager for nodejs, you should also be familiar with it. This command also installs watchify, which is a plugin for browserify, you can learn more about it in [https://github.com/substack/watchify](https://github.com/substack/watchify).
#### <a name = "node-java">node-java
Although we use nodejs primarily, we still have to use some java libraries for some NLP tasks, such as [StanfordCoreNLP](https://stanfordnlp.github.io/CoreNLP/) and [Mallet](http://mallet.cs.umass.edu/). To communicate between nodejs and java, we

I have wrapped up all the javacode inside /jars/nlptoolkit.jar. You should be able to find

## <a name = "run"></a>Things to run

## <a name = "learn"></a>Things to look

## <a name = "mvc"></a>A little about MVC

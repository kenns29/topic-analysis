# Welcome to Our Team

This tutorial briefly describe how to get started on the project. I will cover the following topics:

* [Get the project](#git)
* [Things to Install](#install)
* [Development Environment](#environment)
* [Project Structure](#structure)
* [Database](#database)
* [Other Important Libraries and Utilities](#libraries)
* [A little about MVC](#MVC)


## <a name = "git"></a>Get the project
In order to access and make updates to the project, we have to use git. If you are not familar with git, please check [https://git-scm.com/](https://git-scm.com/).

Our git server is located at [http://vaderserver0.cidse.dhcp.asu.edu:10000/](http://vaderserver0.cidse.dhcp.asu.edu:10000/).  Feel free to sign up with an user name and password, but please ask me for confirmation. Search for topic-analysis to find our project. You can get the project by

```git
$ git clone http://vaderserver0.cidse.dhcp.asu.edu:10000/hxwang/topic-analysis.git
```

You will be asked for user name and password. You can avoid typing these everytime by uploading an SSH key. To find out how to do it, go to deploy key page in our git server, and make sure change the remote
by
```git
$ git remote set-url origin ssh://gitlab@vaderserver0.cidse.dhcp.asu.edu:2323/hxwang/topic-analysis.git
```

Every new member should ask me for a developer access in order to make updates to the project. I recommand everyone to create an own branch.

## <a name = "install"></a>Things to install

In order to get started on the project, there are a few things you will have to install.
* [nodejs](#nodejs)
* [browserify](#browserify)
* [node-java](#node-java)
* [sass](#sass)
* [bower](#bower)

#### <a name = "nodejs"></a>nodejs
Our backend used nodejs, you can install it from [https://nodejs.org/](https://nodejs.org/).
#### <a name = "browserify"></a>browserify
Our frontend javascript is bundled using browserify, which is a nodejs library, you should learn more about it in [http://browserify.org/](http://browserify.org/).

To install browserify, you can do:

```
$ npm install -g browserify watchify
```

Note that **npm** is the package manager for nodejs, you should also be familiar with it. This command also installs **watchify**, which is a plugin for browserify, you can learn more about it in [https://github.com/substack/watchify](https://github.com/substack/watchify).
#### <a name = "node-java">node-java
Although we use nodejs primarily, we still have to use some java libraries for some NLP tasks, such as [StanfordCoreNLP](https://stanfordnlp.github.io/CoreNLP/) and [Mallet](http://mallet.cs.umass.edu/). To communicate between nodejs and java, we used the [node-java library](https://github.com/joeferner/node-java). You should try to get familar with it. Please use the module inside _java/java_init.js_ to load the library and the java codes.

You don't have to do it manually, becase I have included this command in our npm script (I will cover later). But if you really want, you can do
```
$ npm install java
```
**Important For Windows Users**

Installing the node-java library can be a bit tricky on windows. First you will need to have node-gyp installed
```
$ npm install -g node-gyp
```
But installing this requires you to have python and c++ compiler (usually the one comes with Visual Studio), so it may throw you an error if you don't have these installed. If you don't want to install all these manuallly, I suggest you use [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools). You can install this simply by:
```
$ npm install --global windows-build-tools
```
It will take a while.

**java codes**

I have wrapped up all the javacode inside _/jars/nlptoolkit.jar_. This file contained the precompiled java code from my other project [nlptoolkit](http://vaderserver0.cidse.dhcp.asu.edu:10000/hxwang/nlptoolkit). All it does is just wrapping up some NLP libraries, along with some helper functions. It also contains a slightly modifed Mallet library. Ask me for developer access if you think you need to add more functionalities on this code.

#### <a name = "sass"></a>sass

[sass](http://sass-lang.com/) is a preprocesser for css language. We use it to create a css bundle in
_public/css/_. To install sass, you need to first install [Ruby](https://www.ruby-lang.org/en/), and then just do:
```
$ gem install sass
```

### <a name = "bower"></a>bower

[bower](https://bower.io/) is another package manager for front-end libraries. Although it can be used for everything, we are only using this to install css libraries for our project. Install bower by:
```
$ npm install -g bower
```

## <a name = "environment"></a>Development Environment

#### Installing Dependencies

###### javascript
After all the necessary compoments are installed, you should run
```bash
$ npm install
```
It will install all necessary dependencies for our project. If you are not familar with npm. I suggest you take a look at our _package.json_ file. The _dependencies_ field describes all the node libraries we are using. If you want to install additional libraries, please do
```
$ npm install --save [library]
```
**Important:** the _--save_ options adds the library you installed to the _dependencies_ field. This is **very important** because it allow others to know which libraries you have used.

###### css
You also need to install necessary css libraries, use the following command:
```bash
$ cd public/
$ bower install
```
#### Building and Debugging

After installing all the dependencies, now please take a look at _scripts_ field in _package.json_. These are our **_npm scripts_**. Each can be executed by
```
$ npm run [command-name]
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
* **build-js** uses browserify to bundle our front-end javascript codes into _/public/bundle.js_.
* **build-css** uses sass to bundle our css into _/public/css/main.css_.
* **build** builds both javascript and css.
* **watch-js** uses watchify to watch for any changes made to the front-end javascript code and update _/public/bundle.js_.
* **watch-css** uses sass to watch for any changes made to the css and updates _/public/css/main.css_.
* **watch** watchs the javascript.
* **start** starts the back-end server which listens to port 10082.

Typically, during development, you want to open two terminal, one does ```npm run watch-js``` and the other does ```npm run watch-css```, this will make sure all changes you made to the front-end can take effect when you refresh the webpage. You also want to open another terminal for ```npm start```, and you want to redo ```npm start``` everytime you made any changes to the backend.

## <a name = "structure"></a> Project Structure

The project may look like it has a lot of folders, but essentially, it has only a few major components:
```
browser/
  css/
    main.scss
    ...
  js/
    main.js
    ...
public/
  css/
  bundle.js
  bower.json
  ...
routes/
  index.js
  ...
views/
  index.ejs
  ...
app.js
package.json
... /* other modules and resources */
```

* **app.js** is our main module, it initialize the backend server. We used the [Express](https://expressjs.com/) library to build our server.
* **routes/** specifies routing behavior for the server. Please read [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html) for more infomation about routing.
* **views/** stores the rendering components. We use [ejs](https://www.npmjs.com/package/ejs) as our view engine, which has a syntax similar to html.
* **public/** stores the static content for the website, such as the bundled javascript and css files.
* **browser/** is where most of the front-end codes are stored. _browser/css_ stores the css code and _browser/js_ stores the javascript codes. The _main.js_ file is the entry point of all front-end javascript codes.

## <a name = "database"></a> Database

[MongoDB](https://www.mongodb.com/) is the database that we use. Our MongoDB server is located at [vaderserver0.cidse.dhcp.asu.edu:27017/gender_study](vaderserver0.cidse.dhcp.asu.edu).

#### Examine the Data

There are two ways you can examine our database, one is to log in our server using SSH; the other one is to install a MongoDB client on your local machine.

###### SSH
You need a SSH terminal to log in our server, plase ask me for a SSH account. Once you log in, do the following:
```bash
$ mongo
> use gender_study
```

###### MongoDB Client

Refer to [https://docs.mongodb.com/manual/administration/install-community/](https://docs.mongodb.com/manual/administration/install-community/) to install the MongoDB Community Edition in your machine. Once you finish, you can use the same command sequence to access the database.

###### Using Mongo shell command

You should be familiar with Mongo shell command to navigate the database. You can start with [https://docs.mongodb.com/manual/reference/mongo-shell/](https://docs.mongodb.com/manual/reference/mongo-shell/). Some of the most common command that you will use include ```db.find()``` and ```db.findOne()```.

#### MongoDB Nodejs Driver
The web server needs a driver to communicate with the database server, and we use the MongoDB Native Driver for the purpose. There are other alternatives such as [Mongoose](http://mongoosejs.com/), but I opt the native driver for simplicity. Beware when you search for online help, and make sure the solution is for the native driver but not others. The driver API is rather too complicated to explain in this tutorial, you can find some example of how to use it in _db_mongo/_ and _routers/_. You should also refer to the [driver documentation](https://mongodb.github.io/node-mongodb-native/) for help. We are using version 2.2 right now.

#### Database Schema

**Collections:**

```
> show collections
papers
panels
models
users
sessions
...
```

##### papers
Stores information for papers, it has following schema:

```
{
  _id : /* ObjectID */,
  id : /* a unique identifier for the paper */,
  title : /* title of the paper in string */,
  year : /* year the paper is published */,
  type : /* type of the paper:
          1 -> academic paper
          2 -> roundtable/workshop paper
          */,
  panel : /* the id of the panel to which this paper belongs */,
  abstract : /* the abstract of the paper in string */,
  title_tokens : [ /* tokenized title in array */
    {
      text : /* original text of the token */,
      index : /* index of the token in the title */,
      sent_index : /* index of the sentence to which the token belongs */,
      index_in_sent : /* index of the token in the sentence */,
      begin_position : /* the character position of the first character of the token */,
      end_position : /* 1 + the end position of the last character of the token */,
      ner : /* named entity of the token */,
      lemma : /* lemma of the token */
    },
    ...
  ],
  abstract_tokens : [ /* tokenized abstract in array */
    {
      text : /* original text of the token */,
      index : /* index of the token in the abstract */,
      sent_index : /* index of the sentence to which the token belongs */,
      index_in_sent : /* index of the token in the sentence */,
      begin_position : /* the character position of the first character of the token */,
      end_position : /* 1 + the end position of the last character of the token */,
      ner : /* named entity of the token */,
      lemma : /* lemma of the token */
    },
    ...
  ]
}
```

<details>
<summary>Example</summary>
<p>

```json
{
	"_id" : ObjectId("589620d4ecfd0512d1c9e484"),
	"id" : 1980127,
	"title" : "Textbooks as Reinforcers of Sexist Attitudes With Implications for Media",
	"year" : 1980,
	"type" : 1,
	"panel" : 198066,
	"abstract" : "Assessment of textbooks and media as reinforcers of sex bias",
	"title_tokens" : [
		{
			"text" : "Textbooks",
			"index" : 0,
			"sent_index" : 0,
			"index_in_sent" : 1,
			"begin_position" : 0,
			"end_position" : 9,
			"ner" : "O",
			"lemma" : "textbook"
		},
		{
			"text" : "as",
			"index" : 1,
			"sent_index" : 0,
			"index_in_sent" : 2,
			"begin_position" : 10,
			"end_position" : 12,
			"ner" : "O",
			"lemma" : "as"
		},
		{
			"text" : "Reinforcers",
			"index" : 2,
			"sent_index" : 0,
			"index_in_sent" : 3,
			"begin_position" : 13,
			"end_position" : 24,
			"ner" : "O",
			"lemma" : "reinforcer"
		},
		{
			"text" : "of",
			"index" : 3,
			"sent_index" : 0,
			"index_in_sent" : 4,
			"begin_position" : 25,
			"end_position" : 27,
			"ner" : "O",
			"lemma" : "of"
		},
		{
			"text" : "Sexist",
			"index" : 4,
			"sent_index" : 0,
			"index_in_sent" : 5,
			"begin_position" : 28,
			"end_position" : 34,
			"ner" : "O",
			"lemma" : "sexist"
		},
		{
			"text" : "Attitudes",
			"index" : 5,
			"sent_index" : 0,
			"index_in_sent" : 6,
			"begin_position" : 35,
			"end_position" : 44,
			"ner" : "O",
			"lemma" : "attitude"
		},
		{
			"text" : "With",
			"index" : 6,
			"sent_index" : 0,
			"index_in_sent" : 7,
			"begin_position" : 45,
			"end_position" : 49,
			"ner" : "O",
			"lemma" : "with"
		},
		{
			"text" : "Implications",
			"index" : 7,
			"sent_index" : 0,
			"index_in_sent" : 8,
			"begin_position" : 50,
			"end_position" : 62,
			"ner" : "O",
			"lemma" : "implication"
		},
		{
			"text" : "for",
			"index" : 8,
			"sent_index" : 0,
			"index_in_sent" : 9,
			"begin_position" : 63,
			"end_position" : 66,
			"ner" : "O",
			"lemma" : "for"
		},
		{
			"text" : "Media",
			"index" : 9,
			"sent_index" : 0,
			"index_in_sent" : 10,
			"begin_position" : 67,
			"end_position" : 72,
			"ner" : "O",
			"lemma" : "Media"
		}
	],
	"abstract_tokens" : [
		{
			"text" : "Assessment",
			"index" : 0,
			"sent_index" : 0,
			"index_in_sent" : 1,
			"begin_position" : 0,
			"end_position" : 10,
			"ner" : "O",
			"lemma" : "Assessment"
		},
		{
			"text" : "of",
			"index" : 1,
			"sent_index" : 0,
			"index_in_sent" : 2,
			"begin_position" : 11,
			"end_position" : 13,
			"ner" : "O",
			"lemma" : "of"
		},
		{
			"text" : "textbooks",
			"index" : 2,
			"sent_index" : 0,
			"index_in_sent" : 3,
			"begin_position" : 14,
			"end_position" : 23,
			"ner" : "O",
			"lemma" : "textbook"
		},
		{
			"text" : "and",
			"index" : 3,
			"sent_index" : 0,
			"index_in_sent" : 4,
			"begin_position" : 24,
			"end_position" : 27,
			"ner" : "O",
			"lemma" : "and"
		},
		{
			"text" : "media",
			"index" : 4,
			"sent_index" : 0,
			"index_in_sent" : 5,
			"begin_position" : 28,
			"end_position" : 33,
			"ner" : "O",
			"lemma" : "media"
		},
		{
			"text" : "as",
			"index" : 5,
			"sent_index" : 0,
			"index_in_sent" : 6,
			"begin_position" : 34,
			"end_position" : 36,
			"ner" : "O",
			"lemma" : "as"
		},
		{
			"text" : "reinforcers",
			"index" : 6,
			"sent_index" : 0,
			"index_in_sent" : 7,
			"begin_position" : 37,
			"end_position" : 48,
			"ner" : "O",
			"lemma" : "reinforcer"
		},
		{
			"text" : "of",
			"index" : 7,
			"sent_index" : 0,
			"index_in_sent" : 8,
			"begin_position" : 49,
			"end_position" : 51,
			"ner" : "O",
			"lemma" : "of"
		},
		{
			"text" : "sex",
			"index" : 8,
			"sent_index" : 0,
			"index_in_sent" : 9,
			"begin_position" : 52,
			"end_position" : 55,
			"ner" : "O",
			"lemma" : "sex"
		},
		{
			"text" : "bias",
			"index" : 9,
			"sent_index" : 0,
			"index_in_sent" : 10,
			"begin_position" : 56,
			"end_position" : 60,
			"ner" : "O",
			"lemma" : "bias"
		}
	]
}
```
</p></details>

##### panels

```
{
  _id : /* ObjectID */,
  id : /* a unique identifier for the panel */,
  title : /* title of the panel in string */,
  year : /* year of the panel */,
  type : /* type of the panel:
          1 -> academic panel
          2 -> roundtable/workshop panel
          */,
  papers : [ /* array of the id's of papers that belongs to the panel */
    ...
  ],
  abstract : /* the abstract of the panel in string */,
  title_tokens : [ /* tokenized title in array */
    {
      text : /* original text of the token */,
      index : /* index of the token in the title */,
      sent_index : /* index of the sentence to which the token belongs */,
      index_in_sent : /* index of the token in the sentence */,
      begin_position : /* the character position of the first character of the token */,
      end_position : /* 1 + the end position of the last character of the token */,
      ner : /* named entity of the token */,
      lemma : /* lemma of the token */
    },
    ...
  ],
  abstract_tokens : [ /* tokenized abstract in array */
    {
      text : /* original text of the token */,
      index : /* index of the token in the abstract */,
      sent_index : /* index of the sentence to which the token belongs */,
      index_in_sent : /* index of the token in the sentence */,
      begin_position : /* the character position of the first character of the token */,
      end_position : /* 1 + the end position of the last character of the token */,
      ner : /* named entity of the token */,
      lemma : /* lemma of the token */
    },
    ...
  ]
}
```
<details>
<summary>Example</summary>
<p>

```json
{
	"_id" : ObjectId("588a5aacecfd0512d1c9ac69"),
	"id" : 19882,
	"title" : "Activists and Academics Building Lesbian and Feminist Community",
	"year" : 1988,
	"type" : 1,
	"papers" : [
		19880,
		19881,
		19882,
		19883,
		19884
	],
	"abstract" : "This panel provides a forum for Womens Studies scholars librarians and community activists to discuss successes in building alliances and to share strategies for overcoming difficulties in coalition building",
	"title_tokens" : [
		{
			"text" : "Activists",
			"index" : 0,
			"sent_index" : 0,
			"index_in_sent" : 1,
			"begin_position" : 0,
			"end_position" : 9,
			"ner" : "O",
			"lemma" : "activist"
		},
		{
			"text" : "and",
			"index" : 1,
			"sent_index" : 0,
			"index_in_sent" : 2,
			"begin_position" : 10,
			"end_position" : 13,
			"ner" : "O",
			"lemma" : "and"
		},
		{
			"text" : "Academics",
			"index" : 2,
			"sent_index" : 0,
			"index_in_sent" : 3,
			"begin_position" : 14,
			"end_position" : 23,
			"ner" : "O",
			"lemma" : "academic"
		},
		{
			"text" : "Building",
			"index" : 3,
			"sent_index" : 0,
			"index_in_sent" : 4,
			"begin_position" : 24,
			"end_position" : 32,
			"ner" : "O",
			"lemma" : "building"
		},
		{
			"text" : "Lesbian",
			"index" : 4,
			"sent_index" : 0,
			"index_in_sent" : 5,
			"begin_position" : 33,
			"end_position" : 40,
			"ner" : "O",
			"lemma" : "lesbian"
		},
		{
			"text" : "and",
			"index" : 5,
			"sent_index" : 0,
			"index_in_sent" : 6,
			"begin_position" : 41,
			"end_position" : 44,
			"ner" : "O",
			"lemma" : "and"
		},
		{
			"text" : "Feminist",
			"index" : 6,
			"sent_index" : 0,
			"index_in_sent" : 7,
			"begin_position" : 45,
			"end_position" : 53,
			"ner" : "O",
			"lemma" : "Feminist"
		},
		{
			"text" : "Community",
			"index" : 7,
			"sent_index" : 0,
			"index_in_sent" : 8,
			"begin_position" : 54,
			"end_position" : 63,
			"ner" : "O",
			"lemma" : "community"
		}
	],
	"abstract_tokens" : [
		{
			"text" : "This",
			"index" : 0,
			"sent_index" : 0,
			"index_in_sent" : 1,
			"begin_position" : 0,
			"end_position" : 4,
			"ner" : "O",
			"lemma" : "this"
		},
		{
			"text" : "panel",
			"index" : 1,
			"sent_index" : 0,
			"index_in_sent" : 2,
			"begin_position" : 5,
			"end_position" : 10,
			"ner" : "O",
			"lemma" : "panel"
		},
		{
			"text" : "provides",
			"index" : 2,
			"sent_index" : 0,
			"index_in_sent" : 3,
			"begin_position" : 11,
			"end_position" : 19,
			"ner" : "O",
			"lemma" : "provide"
		},
		{
			"text" : "a",
			"index" : 3,
			"sent_index" : 0,
			"index_in_sent" : 4,
			"begin_position" : 20,
			"end_position" : 21,
			"ner" : "O",
			"lemma" : "a"
		},
		{
			"text" : "forum",
			"index" : 4,
			"sent_index" : 0,
			"index_in_sent" : 5,
			"begin_position" : 22,
			"end_position" : 27,
			"ner" : "O",
			"lemma" : "forum"
		},
		{
			"text" : "for",
			"index" : 5,
			"sent_index" : 0,
			"index_in_sent" : 6,
			"begin_position" : 28,
			"end_position" : 31,
			"ner" : "O",
			"lemma" : "for"
		},
		{
			"text" : "Womens",
			"index" : 6,
			"sent_index" : 0,
			"index_in_sent" : 7,
			"begin_position" : 32,
			"end_position" : 38,
			"ner" : "O",
			"lemma" : "woman"
		},
		{
			"text" : "Studies",
			"index" : 7,
			"sent_index" : 0,
			"index_in_sent" : 8,
			"begin_position" : 39,
			"end_position" : 46,
			"ner" : "O",
			"lemma" : "study"
		},
		{
			"text" : "scholars",
			"index" : 8,
			"sent_index" : 0,
			"index_in_sent" : 9,
			"begin_position" : 47,
			"end_position" : 55,
			"ner" : "O",
			"lemma" : "scholar"
		},
		{
			"text" : "librarians",
			"index" : 9,
			"sent_index" : 0,
			"index_in_sent" : 10,
			"begin_position" : 56,
			"end_position" : 66,
			"ner" : "O",
			"lemma" : "librarian"
		},
		{
			"text" : "and",
			"index" : 10,
			"sent_index" : 0,
			"index_in_sent" : 11,
			"begin_position" : 67,
			"end_position" : 70,
			"ner" : "O",
			"lemma" : "and"
		},
		{
			"text" : "community",
			"index" : 11,
			"sent_index" : 0,
			"index_in_sent" : 12,
			"begin_position" : 71,
			"end_position" : 80,
			"ner" : "O",
			"lemma" : "community"
		},
		{
			"text" : "activists",
			"index" : 12,
			"sent_index" : 0,
			"index_in_sent" : 13,
			"begin_position" : 81,
			"end_position" : 90,
			"ner" : "O",
			"lemma" : "activist"
		},
		{
			"text" : "to",
			"index" : 13,
			"sent_index" : 0,
			"index_in_sent" : 14,
			"begin_position" : 91,
			"end_position" : 93,
			"ner" : "O",
			"lemma" : "to"
		},
		{
			"text" : "discuss",
			"index" : 14,
			"sent_index" : 0,
			"index_in_sent" : 15,
			"begin_position" : 94,
			"end_position" : 101,
			"ner" : "O",
			"lemma" : "discuss"
		},
		{
			"text" : "successes",
			"index" : 15,
			"sent_index" : 0,
			"index_in_sent" : 16,
			"begin_position" : 102,
			"end_position" : 111,
			"ner" : "O",
			"lemma" : "success"
		},
		{
			"text" : "in",
			"index" : 16,
			"sent_index" : 0,
			"index_in_sent" : 17,
			"begin_position" : 112,
			"end_position" : 114,
			"ner" : "O",
			"lemma" : "in"
		},
		{
			"text" : "building",
			"index" : 17,
			"sent_index" : 0,
			"index_in_sent" : 18,
			"begin_position" : 115,
			"end_position" : 123,
			"ner" : "O",
			"lemma" : "building"
		},
		{
			"text" : "alliances",
			"index" : 18,
			"sent_index" : 0,
			"index_in_sent" : 19,
			"begin_position" : 124,
			"end_position" : 133,
			"ner" : "O",
			"lemma" : "alliance"
		},
		{
			"text" : "and",
			"index" : 19,
			"sent_index" : 0,
			"index_in_sent" : 20,
			"begin_position" : 134,
			"end_position" : 137,
			"ner" : "O",
			"lemma" : "and"
		},
		{
			"text" : "to",
			"index" : 20,
			"sent_index" : 0,
			"index_in_sent" : 21,
			"begin_position" : 138,
			"end_position" : 140,
			"ner" : "O",
			"lemma" : "to"
		},
		{
			"text" : "share",
			"index" : 21,
			"sent_index" : 0,
			"index_in_sent" : 22,
			"begin_position" : 141,
			"end_position" : 146,
			"ner" : "O",
			"lemma" : "share"
		},
		{
			"text" : "strategies",
			"index" : 22,
			"sent_index" : 0,
			"index_in_sent" : 23,
			"begin_position" : 147,
			"end_position" : 157,
			"ner" : "O",
			"lemma" : "strategy"
		},
		{
			"text" : "for",
			"index" : 23,
			"sent_index" : 0,
			"index_in_sent" : 24,
			"begin_position" : 158,
			"end_position" : 161,
			"ner" : "O",
			"lemma" : "for"
		},
		{
			"text" : "overcoming",
			"index" : 24,
			"sent_index" : 0,
			"index_in_sent" : 25,
			"begin_position" : 162,
			"end_position" : 172,
			"ner" : "O",
			"lemma" : "overcome"
		},
		{
			"text" : "difficulties",
			"index" : 25,
			"sent_index" : 0,
			"index_in_sent" : 26,
			"begin_position" : 173,
			"end_position" : 185,
			"ner" : "O",
			"lemma" : "difficulty"
		},
		{
			"text" : "in",
			"index" : 26,
			"sent_index" : 0,
			"index_in_sent" : 27,
			"begin_position" : 186,
			"end_position" : 188,
			"ner" : "O",
			"lemma" : "in"
		},
		{
			"text" : "coalition",
			"index" : 27,
			"sent_index" : 0,
			"index_in_sent" : 28,
			"begin_position" : 189,
			"end_position" : 198,
			"ner" : "O",
			"lemma" : "coalition"
		},
		{
			"text" : "building",
			"index" : 28,
			"sent_index" : 0,
			"index_in_sent" : 29,
			"begin_position" : 199,
			"end_position" : 207,
			"ner" : "O",
			"lemma" : "building"
		}
	]
}
```

</p></details>

## <a name = "libraries"></a>Other Important Libraries and Utilities

* [d3](#d3)
* [jquery](#jquery)
* [Promise](#Promise)

#### <a name = "d3"></a>d3

[d3](https://d3js.org/) is now perhaps "THE" library to do visualization on web. We use it throughout the entire project. If you are not familiar with it right now, please spend some time to become an **_expert_** of it. You can start with some online [tutorials](https://github.com/d3/d3/wiki/Tutorials), and the [API Reference](https://github.com/d3/d3/wiki/API-Reference) is always your friend. Beware that d3 has two non-compatible versions: [v3](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md) and [v4](https://github.com/d3/d3/blob/master/API.md). We are only using v4, but it helps if you know both. The similarity between these two versions are much greater than their differences. You can check [Changes in D3 4.0](https://github.com/d3/d3/blob/master/CHANGES.md) and [What Makes Software Good?](https://medium.com/@mbostock/what-makes-software-good-943557f8a488) to know more.

#### <a name = "jquery"></a>jquery

[jquery](https://jquery.com/) is the ubiquitous front-end javascript library that does almost everything that's related to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). It is so popular that everyone expects you to know it. So we also use this quite a lot in the project.

###### AJAX

We use jquery to do [AJAX](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) mostly, but you are not constrained to use jquery, you can use [d3-request](https://github.com/d3/d3-request) or even plain javascript if you feel like it. But you want to use jquery, you can check [jQuery.ajax()](http://api.jquery.com/jquery.ajax/) for help. Also, _browser/js/load/_ should give you enough information about how we do ajax in our project.

#### <a name = "promise"></a>Promise

Most asynchronous components in our code are wrapped in [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Promise is natively supported by javascript since [ES6](https://github.com/lukehoban/es6features). It makes asynchronous programming easier (avoiding the [Callback Hell](http://callbackhell.com/)). Promise is easy to use. But if you are new to asynchronous, it will take a while to grasp its concepts. We used Promise throughout the entire project.

###### generator function

Notice that in many times, we use the [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) and [co](https://github.com/tj/co) to simplify our Promise code. For example, this code from _browser/js/control/controller_topic_model_selection.js_:
```javascript
co(function*(){
  $(global.topic_viewer.loading()).show();
  var topics = yield LoadTopicModel().id(selected_model.id).load();
  $(global.topic_viewer.loading()).hide();
  yield global.topic_viewer.display_opt('weight').data(topics).update();
  var data = yield global.topic_document_viewer.year(selected_model.year)
    .type(selected_model.type).level(selected_model.level).load();
  global.topic_document_viewer.data(data).update();
}).catch(function(err){
  console.log(err);
  $(global.topic_viewer.loading()).hide();
});
```
These are handy so it doesn't hurt to know a little bit about them. Also currently, they are only supported by Chrome and Firefox, this is why our project doesn't work in IE right now.

## <a name = "mvc"></a>A little about MVC

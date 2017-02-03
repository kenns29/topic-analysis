'use strict';
var java = require('java');
java.asyncOptions = {
  asyncSuffix: "",
  syncSuffix: "Sync",
  promiseSuffix: "Promise",   
  promisify: require("when/node").lift
};
java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");
java.classpath.push("./jars/nlptoolkit.jar");

module.exports = java;

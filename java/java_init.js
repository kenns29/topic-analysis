'use strict';
var java = require('java');
java.asyncOptions = {
  asyncSuffix: "",     // Don't generate node-style methods taking callbacks
  syncSuffix: "Sync",              // Sync methods use the base name(!!)
  promiseSuffix: "Promise",   // Generate methods returning promises, using the suffix Promise.
  promisify: require("when/node").lift
};
java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");
java.classpath.push("./jars/nlptoolkit.jar");

module.exports = java;

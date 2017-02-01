module.exports.makeTextFile =  function makeTextFile(text, file){
	var data = new Blob([text], {type: 'text/plain'});
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (file !== null) {
      window.URL.revokeObjectURL(file);
    }
    file = window.URL.createObjectURL(data);
    return file;
};

module.exports.makeDownloadURL = function makeDownloadURL(text, file, element){
	var link = document.getElementById(element);
	link.href = makeTextFile(text, file);
	link.style.display = 'block';
};

module.exports.DelayPromise = function(delay) {  
  //return a function that accepts a single variable
  return function(data) {
    //this function returns a promise.
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        //a promise that is resolved after "delay" milliseconds with the data provided
        resolve(data);
      }, delay);
    });
  }
};

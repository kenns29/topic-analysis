var d3 = require('d3');
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
// d3.transition.prototype.then = function(onFulfilled, onRejected) {
//
//    // Work out the transition object which is either __transition__ or __transition_fill_
//    // depending on whether or not it is named
//    const transitionName = this.namespace || "__transition__";
//
//    // Construct a promise that is going to be returned, this
//    // promise will be stored (with any other promises) against
//    // the transition object
//    return new Promise((resolve, reject) => {
//
//      // We're going to count the number of elements
//      // that we're transitioning over, such that the promise
//      // only fires when all elements have finished transitioning
//      let n = 0;
//
//      // Store the resolve of the promise against each element,
//      // along with incrementing our counter. Note that we don't
//      // currently fire a rejected
//      this.each(function() {
//        const transition = this[transitionName];
//        transition._promises = transition._promises || [];
//        transition._promises.push(resolve);
//        n++;
//      })
//      .each("end", function() {
//      	 const transition = this[transitionName];
//
//        // If this is the last element, then execute all the promises
//        if(!--n) { transition._promises.forEach(r => r()); }
//
//        // Every element stores it's promise, regardless of whether
//        // it is the last one (the only one which will execute) so
//        // we need to clean up as we go along
//        transition._promises = [];
//      });
//    }).then(onFulfilled, onRejected);
// };
module.exports = d3;

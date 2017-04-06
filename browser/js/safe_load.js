module.exports = exports = safe_load;
function safe_load(){
  var counter = 0;
  var p_function = null;
  function load(){
    if(!p_function) return Promise.reject('NO_DATA');
    var cp = new CounterPromise(p_function, ++counter);
    return cp.then(function(cl){
      if(cl.counter === counter) return Promise.resolve(cl.data);
      else return Promise.reject('CANCEL_PROMISE');
    });
  }
  function ret(_promise){
    if(arguments.length > 0){ret.promise(_promise);}
    return load();
  }
  ret.promise = function(_){
    if(arguments.length > 0){
      if(typeof _ === 'function'){
        p_function = _;
      } else {
        p_function = p_constant(_);
      }
      return ret;
    } else return p_function;
  };
  ret.load = load;
  return ret;
}

class CounterPromise{
    constructor(promise, counter){
      this.set_promise(promise);
      this._counter = counter;
    }
    get promise(){
      return this._promise;
    }
    get counter(){
      return this._counter;
    }
    get data(){
      return this._data;
    }
    set counter(counter){
      this._counter = counter;
    }
    set_promise(promise){
      if(typeof promise === 'function'){
        this._promise = promise;
      } else {
        this._promise = p_constant(promise);
      }
    }
    then(resolve){
      var self = this;
      return this._promise().then(function(data){
        self._data = data;
        return resolve(self);
      });
    }
}

function p_constant(p){
  return function(){return p;};
}

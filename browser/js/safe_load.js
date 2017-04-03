function safe_load(){
  var counter = 0;
  var p_function = function(){return Promise.reject('NO DATA');};
  var p_constant = function(p){return function(){return p;};};
  function load(_promise){
    var p =  new CounterPromise(function(resolve, reject){
      if(counter === this.counter){
        resolve()
      }
    }, ++counter);
    ++p.counter;
  }
  function ret(_promise){
    if(arguments.length > 0){promise = _promise;}

  }
  ret.promise = function(_){
    if(arguments.length > 0){

    } else return
  };
  return ret;
}

class CounterPromise extends Promise{
    this.counter = 0;
    constructor(resolver, counter){
      super(resolver);
      this.counter = counter;
    }
}

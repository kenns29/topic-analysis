var LoadPaper = require('../load/load_papers');
var safe_load = require('../safe_load')();
t5();
function p1(){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('p1');
    },1000);
  });
}
function p2(){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('p2');
    },5000);
  });
}

function t1(){
  safe_load(p1()).then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
  safe_load(p2()).then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
}
function t2(){
  safe_load(p2()).then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
  safe_load(p1()).then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
}
function t3(){
  safe_load(p1()).then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
  setTimeout(function(){
    safe_load(p2()).then(function(data){
      console.log('data', data);
    }).catch(function(err){
      console.log(err);
    });
  }, 2000);
}
function t4(){
  safe_load.promise(p1()).load().then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
  safe_load.promise(p2()).load().then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
}
function t5(){
  safe_load.promise(p1).load().then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
  safe_load.promise(p2).load().then(function(data){
    console.log('data', data);
  }).catch(function(err){
    console.log(err);
  });
}

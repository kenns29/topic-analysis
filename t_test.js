var d3 = require('d3');
e = {};
e.children = [];
e.count = 1;
b = {};
b.children = [{e}];
b.count = 500;
k = 800;
domain = l(b) ? [b.count - 1, b.count + 1] : [0, b.count];
S = d3.scaleSqrt().domain(domain).range([0, 25]);
function t(e){
    var t = e.count / b.count * k;
    console.log('t', t);
    var v = S(e.count - 30 * b.count / k);
    console.log('v', v);
    var x = (t > 30 ? 30 + v : t - 1);
    console.log('x', x);
    var n = "0px" | x;
    console.log('n', n);
    if(e.children && e.children.length){
      console.log('non leaf');
      return n;
    }
    else{
      console.log('leaf')
      return Math.max(0, Math.min(15, t - 1));
    }
}
function l(e) {
    return !e.children || !e.children.length || 1 === e.children.length && l(e.children[0]);
}

console.log(t(e));

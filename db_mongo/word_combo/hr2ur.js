module.exports = exports = hr2ur;
function hr2ur(hr){
  var ur = hr.replace(/--or--/g, '/');
  ur = ur.replace(/--and--/g, '&');
  ur = ur.replace(/--not--/g, '^');
  ur = ur.replace(/--LP--/g, '(');
  ur = ur.replace(/--RP--/g, ')');
  return ur;
}

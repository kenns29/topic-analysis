module.exports = exports = hr2ur;
function hr2ur(hr){
  var hr = ur.replace(/--or--/g, '/');
  hr = hr.replace(/--and--/g, '&');
  hr = hr.replace(/--not--/g, '^');
  hr = hr.replace(/--LP--/g, '(');
  hr = hr.replace(/--RP--/g, ')');
  return hr;
}

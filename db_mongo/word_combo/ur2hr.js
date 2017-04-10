module.exports = exports = ur2hr;
function ur2hr(ur){
  var hr = ur.replace('/\//g', '--or--');
  hr = hr.replace(/&/g, '--and--');
  hr = hr.replace(/\^/g, '--not--');
  hr = hr.replace(/\(/g, '--LP--');
  hr = hr.replace(/\)/g, '--RP--');
  return hr;
}

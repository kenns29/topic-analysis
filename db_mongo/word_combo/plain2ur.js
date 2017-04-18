module.exports = exports = plain2ur;
function plain2ur(plain){
  var ur = '';
  var w = '';
  var has_space = false;
  for(let i = 0;i < plain.length; i++){
    let char = plain.charAt(i);
    if(char.match(/\s/)){
      has_space = true;
    } else {
      if(has_space && w.match(/\w/) && char.match(/\w/)){
        ur += '_' + char;
      } else {
        ur += char;
      }
      has_space = false;
      w = char;
    }
  }
  return ur;
}

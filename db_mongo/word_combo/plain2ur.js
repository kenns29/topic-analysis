module.exports = exports = plain2ur;
function plain2ur(plain){
  return plain.replace(/\s+/g, '_');
}

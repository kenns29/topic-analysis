module.exports = exports = load;
function load(passport){
  return function(req, res){
    res.render('userprofile', {user : req.user});
  };
}

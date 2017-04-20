module.exports = exports = load;
function load(passport){
  return function(req, res) {
    res.render('index', { title: 'Topic Analysis', user: req.user});
  };
}

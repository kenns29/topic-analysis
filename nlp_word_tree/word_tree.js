var co = require('co');
module.exports = exports = word_tree;
function word_tree(){
  var root = null;
  var token_stop_pattern = /\n|\r\n|\r|(?:http[s]?|ftp|file):\/\/\S+(\/\S+)*/i;
  var use_stop_pattern = false;
  var use_stopwords = false;
  var stopwords = new Set();
  var reverse = false;
  var root_word = 'studies';
  function token_acc(d){return d.text;}
  function tokens_acc(d){return d.title_tokens;};
  function append_tree(root_word, tokens){
    var add_flag = false;
    var pre_node = root;
    var root_word_lower = root_word.toLowerCase();
    if(!reverse) tokens.forEach(each_token);
    else{
      //look for the last encounter of the root word
      let i = 0;
      for(i; i < tokens.length; i++){
        let token = tokens[i];
        if(token_acc(token).toLowerCase() === root_word_lower){
          break;
        }
      }
      if(i === tokens.length) return;
      for(i; i>=0; i--) each_token(tokens[i]);
    }

    function each_token(token){
      var word = token_acc(token);
      var word_lower = word.toLowerCase();
      if((use_stop_pattern && word.match(token_stop_pattern)) ||
        (use_stopwords && stopwords.has(word_lower))) return;
      //after the first encounter of the root word
      if(add_flag){
        let found = false;
        for(let i = 0; i < pre_node.children.length; i++){
          let node = pre_node.children[i];
          let pre_word_lower = token_acc(node.tokens[0]).toLowerCase();
          if(pre_word_lower === word_lower){
            ++node.count; found = true; pre_node = node;
            break;
          }
        }
        if(!found){
          let new_node = {tokens : [token], count : 1, children : []};
          pre_node.children.push(new_node);
          pre_node = new_node;
        }
      }
      //if no match found, append the new node carrying the term to the previous node
      else{
        if(root_word_lower === word.toLowerCase()){
          add_flag = true;
          if(root === null){
            root = {tokens : [token], count : 1, children:[]};
          } else {
            ++root.count;
          }
          pre_node = root;
        }
      }
    }
  }
  function create(docs){
    return co(function*(){
      root = null;
      docs.forEach(function(doc){
        var tokens = tokens_acc(doc);
        append_tree(root_word, tokens);
      });
      if(root !== null){
        add_end(root);
        compress(root, reverse);
      }
      return Promise.resolve(ret);
    }).catch(function(err){console.log(err);});
  }
  var ret = {};
  ret.root = function(_){return arguments.length > 0 ? (root = _, ret) : root;};
  ret.create = create;
  ret.append_tree = append_tree;
  ret.token = function(_){
    if(arguments.length > 0) {token_acc = _; return ret;} return ret;
  };
  ret.tokens = function(_){
    if(arguments.length > 0) {tokens_acc = _; return ret;} return ret;
  };
  ret.use_stop_pattern = function(_){return arguments.length > 0 ? (use_stop_pattern = _, ret) : use_stop_pattern;};
  ret.use_stopwords = function(_){return arguments.length > 0 ? (use_stopwords = _, ret) : use_stopwords;};
  ret.stop_pattern = function(_){return arguments.length > 0 ? (token_stop_pattern = _, ret) : token_stop_pattern;};
  ret.stopwords = function(_){return arguments.length > 0 ? (stopwords = _, ret) : stopwords;};
  ret.to_lower_case = function(_){return arguments.length > 0 ? (to_lower_case = _, ret) : to_lower_case;};
  ret.reverse = function(_){return arguments.length > 0 ? (reverse = _, ret) : reverse;};
  ret.root_word = function(_){return arguments.length > 0 ? (root_word = _, ret) : root_word;};
  return ret;
}
function add_end(root){
  recurse(root);
  return root;
  function recurse(r){
    if(r && !is_leaf(r)){
      r.children.forEach(recurse);
      let children_count = r.children.reduce(function(pre, cur){
        return pre + cur.count;
      }, 0);
      if(r.count > children_count){
        r.children.push({tokens : [make_token('.', '.')], count : r.count - children_count, children:[]});
      }
    }
  }
}
function compress(root, reverse){
  recurse(root);
  return root;
  function recurse(r){
    if(r && !is_leaf(r)){
      if(r.children.length === 1){
        r.tokens[reverse ? 'unshift' : 'push'](r.children[0].tokens[0]);
        r.children = r.children[0].children;
        recurse(r);
      }
      else r.children.forEach(recurse);
    }
  }
}
function is_leaf(r){
  return !r.children || r.children.length === 0;
}
function make_token(text, lemma){
  return {text: text, lemma:lemma};
}


/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
('%'?[0-9a-zA-Z]+'%'?'_'?)+     return 'PHRASE'
"&"                             return '&'
"/"                             return '/'
"^"                             return '^'
"%"                             return '%'
"("                             return '('
")"                             return ')'
<<EOF>>                         return 'EOF'
.                               return 'INVALID'

/lex

/* operator associations and precedence */

%left '^'
%left '^' '&' '/'
%start expressions

%% /* language grammar */

expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

e
    : e '&' e
        { $$ = {'$and' : [$1,$3]};}
    | e '/' e
        { $$ = {'$or' : [$1, $3]};}
    | '^' e
        { $$ = {'$not' : [$2]};}
    | '(' e ')'
        { $$ = $2;}
    | PHRASE
        {
          $$ = yytext;
        }
    ;

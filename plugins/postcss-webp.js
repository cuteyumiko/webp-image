var postcss = require('postcss');
var helpers = require( 'postcss-helpers');
var fs = require('fs');
module.exports = postcss.plugin('postcss-webp', function (opts) {
    var defaultOptions = {
      suffix:['.png', '.jpg'],
      rules:{
        from:'/images',
        to:'/images/webp'
      }
    };
  
  opts = Object.assign({}, defaultOptions, opts);

    return function (style, result) {
      var selectors = [];
      var impAttrs = [];
    
        style.walk(function(node){
          if (!node.selector) {
            return ;
          }
          var selArr=[] ;
            node.walkDecls(function(decl){
              if (decl.prop.toLocaleLowerCase() == 'background-position') {
                if(node.selector.indexOf(',')>-1){
                
                   selArr = node.selector.split(',').map(function(e,i){
                    if(/\.chrome/.test('.chrome')){
                      return e;
                    }else{
                      return '.chrome '+e;
                    } 
                    
                  })
                }
                var  str = selArr.join(',') ;
                impAttrs.push((str||node.selector) +" { background-position:"+decl.value+" !important }");
              }

              if (!decl.value.match( helpers.regexp.URLS ) ) { return; }
              if (!decl.value ) {
                return;
              }
              var ruleValue = decl.value;
              
              opts.suffix.forEach(function(suffix) {
                ruleValue = ruleValue.replace(suffix, '.webp');
              });
              //isFixed
              if(/\/webp\//.test(ruleValue)==false){
                ruleValue =ruleValue.replace(opts.rules.from, opts.rules.to);
              }
              selectors.push((str||node.selector) +" { background:"+ruleValue+"}")
              
            });
          
        });


        var finallyArray =  selectors.concat(impAttrs);

        fs.writeFile(opts.dest, finallyArray.join("\n"), (err) => {
          if (err) throw err;
        });
    };
});
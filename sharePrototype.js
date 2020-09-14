//jQuery共享原型对象
var $ = function() {
  return new $.prototype.init()
}
$.prototype = {
  init:function() {

  },
  css:function() {

  }
}
$.prototype.init.prototype = $.prototype

var foo = $()
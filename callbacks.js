/**
 * 1、once fire只能执行一次
 * 2、memory fire执行过一次后 下次add后立即执行
 * 3、stopOnfalse 执行某个处理函数返回false，则终止后续处理函数的执行
 * 
*/
const optionsCache = {}
var callback = function(options) {
  options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : {}
  const list = []
  let length,isFire,memoryArg,start,startIndex
  let index = startIndex || 0
  let self =  {
    add:function() {
      start = list.length; //在push之前
      Array.prototype.slice.call(arguments).forEach(function(fn) {
        if(toString.call(fn) === '[object Function]') {
          list.push(fn)
        }
      })
      if(memoryArg) {
        startIndex = start
        memoryArg && fire(memoryArg)
      }
    },
    fireWith:function(context,args) {
      isFire = true
      memoryArg = args
      length = list.length
      for(;index < length; index++) {
        //声明了stopOnfalse参数 则处理函数返回false，则break
        if(options.stopOnFalse && list[index].apply(context,[...args]) === false) break;
      }
    },
    fire:function() {
      //指定once参数，则只能fire调用一次
      if(!options.once || !isFire) {
        self.fireWith(this,arguments)
      }
    }
  }
  return self
}

function createOptions(options) {
  var object = optionsCache[options] = {}
  options.split(/\s+/).forEach(function(op) {
    object[op] = true
  })
  return object
}
var foo = callback()
foo.add(function() {
  console.log(123)
})
let obj = {
  name:111
}
foo.fire.call();
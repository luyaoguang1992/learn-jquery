/**
 * 1、once fire只能执行一次
 * 2、memory fire执行过一次后 下次add后立即执行
 * 3、stopOnfalse 执行某个处理函数返回false，则终止后续处理函数的执行
 * 4、unique 队列内不能有两个重复的callback
*/
import './utils'
const optionsCache = {}
var callback = function(options) {
  options = typeof options === 'string' ? (optionsCache[options] || createOptions(options)) : {}
  const list = []
  let length,isFire,memoryArg,index,start,startIndex;
  startIndex = 0
  let self =  {
    has:function(fn) {
      return fn ? list.indexOf(fn) > -1 : false
    },
    add:function() {
      start = list.length; //在push之前
      Array.prototype.slice.call(arguments).forEach(function(fn) {
        if(isFunction(fn) && (!options.unique || !self.has(fn))) {
          list.push(fn)
        }
      })
      if(memoryArg) {
        startIndex = start
        memoryArg && self.fire(memoryArg)
      }
    },
    fireWith:function(context,args = []) {//fireWith允许传入指定的对象调用
      index = startIndex || 0
      startIndex = 0
      isFire = true
      memoryArg = args
      length = list.length
      for(;index < length; index++) {
        //声明了stopOnfalse参数 则处理函数返回false，则break
        if(list[index].apply(context,args) === false && options.stopOnFalse) break;
      }
    },
    fire:function() {
      //指定once参数，则只能fire调用一次
      if(!options.once || !isFire) {
        self.fireWith(this,[...arguments]) 
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
var callList = callback('memory')
callList.add(function() {
  console.log(1)
})
callList.fire()
callList.add(function() {
  console.log(2)
})
callList.fire()
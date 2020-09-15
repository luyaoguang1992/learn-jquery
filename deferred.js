//Promise/A+规范 or Deferred
//Promise作为一个模型，提供一个在软件工程中描述延时(或将来)概念的解决方案
// 1、Promise表示一个异步操作的最终结果
// 2、与Promise最主要的交互方法是，通过将函数传入它的then方法，从而获取Promise最终的值或Promise最终拒绝(reject)的原因
// 3、一个Promise必须处于以下其中一个状态：pending、fulfilled、rejected
// 4、一个Promise必须提供一个then方法来获取其值或原因。


//jQuery.Deferred() 是一个构造函数，返回一个对象来注册多个回调。调用回调队列，并转达任何同步或异步函数的成功/失败状态
//deferred.done() 添加成功回调
//deferred.fail() 添加失败回调
//deferred.progress() 添加pending处理程序
//jQuery.when() 提供一种方法执行一个或多个对象的回调函数，
//.promise() 返回一个Promise对象用来观察当某种类型的所有行动绑定到集合，排队是否还是已经完成


const optionsCache = {}


function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]'
}
function isArray(obj) {
  return toString.call(obj) === '[object Array]'
}

function extend() {
  let target = arguments[0] || {} //操作的目标对象
  let len = arguments.length //参数长度
  let i = 1
  let deep = false //是否为深拷贝
  if(typeof target === 'boolean') {
    deep = target
    target = arguments[i++]
  }
  if(typeof target !== 'object') {//防止传入的参数不是对象
    target = {}
  }
  if(len === 1) {
    target = this
  }
  for(; i < len; i++) {
    let option = arguments[i];//需要extend的对象
    if(option == null) return
    for(let key in option) {
      let copy = option[key]
      let src = target[key]
      let copyIsArray = false
      let clone
      if(deep && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) { //如果是深拷贝 并且拷贝的是对象或数组
        if(copyIsArray) {
          clone = src && isArray(src) ? src : []
        } else {
          clone = src && isPlainObject(src) ? src : {}
        }
        target[key] = extend(deep,clone,copy)
      } else if(copy != undefined) {
        target[key] = copy
      }
    }
  }
  return target
}

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
    fireWith:function(context,args = []) {//fireWith允许传入指定的对象调用
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


function Deferred(func) {
  let state = "pending"
  let tuples = [
    ['resolve','done',callback('once memory'),'resolved'],
    ['reject','fail',callback('once memory','rejected')],
    ['notify','progress',callback('memory')]
  ]
  let promise = {
    state:function() {
      return state
    },
    then:function() {

    },
    promise:function(obj) {
      return obj != null ? extend(obj,promise) : promise;
    }
  }
  let deferred = {}
  tuples.forEach(function(tuple,i) {
    let list = tuple[2], //取出回调队列对象
        stateString = tuple[3];//取出最终状态
    promise[tuple[1]] = list.add;//给promise对象注册add方法 [done | fail | progress]
    if(stateString) {
      list.add(function() {
        state = stateString //修改状态
      })
    }
    deferred[tuple[0]] = function() { // [resolve| reject | notify]
      //如果调用fireWith的对象是deferred 则返回promise 否则返回this
      deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments)
      return this
    }
    //执行队列 调用队列中处理函数并且给他们传参 绑定执行时上下文对象
    deferred[tuple[0] + 'With'] = list.fireWith
  }) 
  promise.promise(deferred)
  return deferred
}




var wait = function() {
  var der = Deferred();
  var test = function() {
    console.log('aaaaa')
    der.resolve()
  }
  setTimeout(() => {
    test()
  }, 2000);
  return der
}
wait().resolve()
// $.when(wait()).done(function() {
//   console.log('成功')
// }).fail(function() {
//   console.log('失败')
// })
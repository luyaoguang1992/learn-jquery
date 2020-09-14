/**
 * 1.如果第一个参数为bool 控制是否为深拷贝
 * 2.如果只有1个参数，则是为jQuery扩展属性/方法
 */
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
function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]'
}
function isArray(obj) {
  return toString.call(obj) === '[object Array]'
}
let data = extend(true,{name:'xxx',list:{a:1}},{age:1,list:{b:1}})
console.log(data)
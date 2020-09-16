/**
 * 思考:extend方法用于合并多个对象，支持深拷贝
 * 多场景使用:
 * 1、传入一个对象参数，对jQuery对象进行扩展
 * 2、传入多个对象参数、用后面的对象对第一个对象进行扩展
 * 3、第一个参数为bool，则用于控制是否为深拷贝
 */
const utils = require('./utils')
function extend() {
  if(!arguments.length) return {} //防止出现未传参的情况
  let target = arguments[0] || {} //找到用于扩展的目标对象
  let i = 1 //下标为0的对象是被扩展对象 所以我们从下标为1的对象开始遍历
  let deep = false //是否为深拷贝
  let len = arguments.length //保存所传入参数的长度 用于遍历使用
  if(typeof target === 'boolean') {//如果第一个参数是布尔值，则用来指定是否为深拷贝
    deep = target 
    target = arguments[i++] //重新指定目标对象 i++
  }
  if(typeof target !== 'object') {//防止传入的目标不是对象类型
    target = {}
  }
  if(len === 1) {//如果只传入一个参数，则是为jQuery本身扩展属性/方法
    target = this
  }
  for(; i < len; i++) {
    let obj = arguments[i] //取出对应对象
    for(let key in obj) {//for in 循环该对象
      let copy = obj[key] //取出扩展对象属性
      let src = target[key] //取出被扩展对象对应的属性
      let clone,copyIsArray
      if(deep && (utils.isPlainObject(copy) || (copyIsArray = utils.isArray(copy)))) {//如果为深拷贝 且 扩展的属性是引用类型
        if(copyIsArray) {//如果是数组
          clone = src && utils.isArray(src) ? src : []
        } else {
          clone = src && utils.isPlainObject(src) ? src : {}
        }
        target[key] = extend(deep,clone,copy)
      } else {
        target[key] = copy
      }
    }
  }
  return target
}

let foo  = {name:1,list:{a:1}}
let bar = {age:2,list:{b:2}}
console.log(extend(true,foo,bar))

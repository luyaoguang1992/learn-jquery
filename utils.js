exports.isFuntion = function (fn) {
  return toString.call(fn) === '[object Function]'
}
exports.isPlainObject =  function (obj) {
  return toString.call(obj) === '[object Object]'
}
exports.isArray = function (array) {
  return toString.call(array) === '[object Array]'
}

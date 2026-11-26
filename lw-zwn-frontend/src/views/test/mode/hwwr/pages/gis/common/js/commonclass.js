/**
 * Created by maomao on 2016/6/8.
 */
Array.prototype.indexOf = function (val) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i
    }
  }
  return -1
}
Array.prototype.remove = function (val) {
  const index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

//根据coock中的所有范围编码，控制监测对象图层显示数组
function getLayerdefinitions() {
  const extentcoockie = $.cookie('grcd')
  if (extentcoockie == null) {
    return
  }
  const extentjson = $.parseJSON(extentcoockie)
  const extentArray = extentjson.grcd.split(',')
  const extentArrayNew = []
  if (extentArray == null) {
    return
  }
  $.each(extentArray, function (subitemindex, subitemvalue) {
    const itemextent = "'" + subitemvalue + "'"
    extentArrayNew.push(itemextent)
  })
  const layerDefinitions = []
  const definitions = '(' + extentArrayNew.join() + ')'
  for (let layerlength = 0; layerlength < 15; layerlength++) {
    layerDefinitions[layerlength] = 'GRCD In ' + definitions
  }
  console.log(layerDefinitions[0])
  return layerDefinitions
}

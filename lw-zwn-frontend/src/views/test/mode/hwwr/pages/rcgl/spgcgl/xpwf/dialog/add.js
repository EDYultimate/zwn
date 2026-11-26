let ptype = 'update'
$(document).ready(function () {
  if (id === null || id === 'null' || id === undefined || id === '') {
    id = ''
    ptype = 'add'
  }

  initData()
  initUpload('1', 'VERF_APL_DOC')
  initUpload('2', 'RELAT_DOC')
  getFile('1', 'VERF_APL_DOC')
  getFile('2', 'RELAT_DOC')

  initTips()
})

let sids
function ckInfo(id, e) {
  const ckinput = $(e.parentElement.children[0]).prop('disabled')
  // var sids = $('#type_id').getSelected().ids;
  // 	// if (sids.indexOf(id)<0) {
  // 	// 	return;
  // 	// }
  if (ckinput) {
    return
  }
  sids = id
  $('#choose_tm').val(e.innerText)
  layer.open({
    type: 1,
    title: false,
    content: $('#clooseTM'),
    btnAlign: 'c',
    btn: ['确定'],
    yes: function (index, layero) {
      $(
        $('.select_multi_li [value="' + sids + '"]')
          .parent()
          .children()[2]
      ).text($('#choose_tm').val())
      $('#type_id').val($('#type_id').getSelected().vals[0])
      layer.closeAll()
    }
  })
}

function updateTM() {
  const tm = $('#choose_tm').val()
  if (tm === null || tm === '') {
    alert('请选择时间')
    return
  }
  layer.closeAll()
}

const options = [
  { id: '01', name: '申请', disabled: true },
  { id: '02', name: '补正', disabled: true },
  { id: '03', name: '材料接收', disabled: true },
  { id: '04', name: '受理', disabled: true },
  { id: '05', name: '技术审查', disabled: true },
  { id: '06', name: '修改报告接收', disabled: true },
  { id: '07', name: '许可决定', disabled: true },
  { id: '08', name: '发证申请' },
  { id: '09', name: '工程核验' },
  { id: '10', name: '制证' }
]

function getType(data, type_ord) {
  if (type_ord === undefined) {
    type_ord = ''
  }
  $.ajax({
    type: 'GET',
    url: basePath + 'spgc/getWpcType?ord=' + type_ord,
    contentType: 'application/json',
    async: true,
    success: function (types) {
      setDisabledOption(data, types)
    }
  })
}

function setDisabledOption(data, types) {
  const typeTm = {}
  if (data && data.length > 0 && data[0].types) {
    for (var i = 0; i < data[0].types.length; ++i) {
      typeTm[data[0].types[i].type_id] = data[0].types[i].tm
    }
  }

  if (types && types.length > 0) {
    const infos = {}
    let type_no = '07'
    let maxtype = 7
    if (typeTm !== {}) {
      for (var i in typeTm) {
        if (parseInt(i) > maxtype) {
          maxtype = parseInt(i)
        }
        infos[i] = typeTm[i]
      }
    }
    if (maxtype === 7) {
      type_no = formatByZero(maxtype, 2)

      // 添加当前时间
      infos[type_no] = moment().format('YYYY-MM-DD')
    }

    $('#type_tm').val(infos[type_no])
    $('#choose_tm').val(infos[type_no])
    const item = $('#type_id').getItemById(options, type_no)
    $('#type_id').val(item.name + ' ' + infos[type_no])
    $('#type_id').cusSelect(options, [type_no], true, infos, ckInfo)

    if (type_no === '10') {
      $('.wpcType10').show()
    } else {
      $('.wpcType10').hide()
    }
  }
}

function initData() {
  if (id === '') {
    getType([], 7)
    return
  }
  $.ajax({
    type: 'GET',
    url: basePath + 'spgc/getWpcWF?id=' + id,
    contentType: 'application/json',
    async: true,
    success: function (data) {
      let type_ord = 0
      if (data && data.length > 0) {
        const row = data[0]
        for (const k in row) {
          if (k === 'type_id') {
            $('#type_id').val(row.type_nm + ' ' + row.type_tm)
            continue
          }
          $('#' + k).val(row[k])
        }
        type_ord = row.type_ord
      }
      getType(data, type_ord)
    }
  })
}

/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
const fileNames = []
const fileIds = []
// 从保存的数组中删除对应文件
const deleteFIleFromArray = function (fileid) {
  if (fileid) {
    if (fileIds.indexOf(fileid) < 0) {
      return
    }
    fileNames.splice(fileIds.indexOf(fileid), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
  }
}

// 添加文件名称
const addFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) >= 0) {
      return false
    }
    fileNames.push(filename)
    fileIds.push(fileid)
    return true
  }
  return false
}
//删除文件名称
const rmFileName = function (filename, fileid) {
  if (filename) {
    if (fileNames.indexOf(filename) < 0) {
      return false
    }
    fileNames.splice(fileNames.indexOf(filename), 1)
    fileIds.splice(fileIds.indexOf(fileid), 1)
    return true
  }
  return false
}

// 生成文件上传div
const getFileDiv = function (filename, fileid, filesize, mang_cd) {
  const filediv =
    "<tr id='file" +
    fileid +
    "' ><td><a onclick='javascript:viewfile(\"" +
    fileid +
    '")\'>' +
    filename +
    "</a></td><td><span id='filesize" +
    fileid +
    "' >" +
    filesize +
    '</span>' +
    "<span id='progress" +
    fileid +
    "' ></span></td><td><a onclick=\"deletefile('" +
    fileid +
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>删除</a>" +
    '</td><td><a onclick="dlfile(\'' +
    fileid +
    "', '" +
    filename +
    "', '" +
    mang_cd +
    "')\" style='cursor:pointer;color: rgb(4, 84, 195);'>下载</a></td></tr>"
  addFileName(filename, fileid)
  return filediv
}

// 删除文件上传对应div
const removeFileDiv = function (fileid) {
  const element = document.getElementById('file' + fileid)
  element.parentNode.removeChild(element)
}

// 控制进度条
const progressctrl = function (fileid, proc) {
  $('#progress' + fileid).text(' (' + proc + ')')
}

/* 校验文件
 * 判断文件大小及是否已上传
 */
const validfile = function (filename, filesize) {
  if (fileNames.indexOf(filename) >= 0) {
    alert(filename + ' 已上传，请选择其他文件')
    return false
  }

  if (filesize > 6291456) {
    alert(filename + ' 大于5M，请选择小于5M的文件')
    return false
  }

  if (filesize == 0) {
    alert(filename + ' 是空文件，请重新选择上传文件')
    return false
  }

  return true
}

function genUUID(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

//32位UUID
function UUID() {
  return genUUID(32, Math.floor(Math.random() * 32) + 10)
}

function getFile(no, mang_cd) {
  pdata = {
    wpc_cd: id,
    mang_cd: ''
  }

  $.ajax({
    url: basePath + 'spgc/getWpcFile',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; ++i) {
          $('#uploadfiles' + no).append(
            getFileDiv(
              data[i].file_titl + data[i].file_ext,
              data[i].file_cd,
              data[i].file_size + 'KB',
              data[i].mang_cd
            )
          )
        }
      }
    }
  })
}

// 上传文件
var initUpload = function (no, mang_cd) {
  const FileController = basePath + 'spgc/upload'
  $('#uploadfile' + no).fileupload({
    url: FileController,
    add: function (e, data) {
      // 生成文件uuid
      const uuid = UUID()
      const filename = data.files[0].name
      const filesize = Math.ceil(data.files[0].size / 1024)

      $('#uploadfiles' + no).append(getFileDiv(filename, uuid, filesize + 'KB', mang_cd))
      const scrollheight = $('#uploadfiles' + no).height()
      $('#scrollfiles' + no).scrollTop(scrollheight)
      data.fileUUID = uuid
      // 添加文件uuid到request
      data.formData = { file_cd: uuid, wpc_cd: id, file_size: filesize, mang_cd: mang_cd }
      data.submit()
    },
    done: function (e, data) {
      const fileid = data.fileUUID
      progressctrl(fileid, '100%')
      const res = data.result
      if (!res) {
        // 上传错误，则删除文件上传div
        removeFileDiv(fileid)
        deleteFIleFromArray(fileid)
        alert('上传失败')
      } else if (fileIds.indexOf(fileid) < 0) {
        fileIds.push(fileid)
      }
    },
    progress: function (e, data) {
      let progress = parseInt((data.loaded / data.total) * 100, 10)
      if (progress == 100) {
        // 前台传递100%之后，后台需要消耗存储时间
        progress = 98
      }
      const fileid = data.fileUUID
      progressctrl(fileid, progress + '%')
    }
  })
}

// 删除文件
const deletefile = function (fileid, mang_cd) {
  pdata = {
    wpc_cd: id,
    file_cd: fileid,
    mang_cd: mang_cd
  }
  $.ajax({
    url: basePath + 'spgc/deleteFile',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (!data) {
        alert(data.message)
        return
      }
      removeFileDiv(fileid)
      deleteFIleFromArray(fileid)
    }
  })
}

// 获取文件后缀名
const getFileExt = function (filename) {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename
}

function dlfile(file_cd, filename, mang_cd) {
  $.fileDownload(basePath + 'spgc/downloadfile', {
    httpMethod: 'POST',
    data: { wpc_cd: id, file_cd: file_cd, mang_cd: mang_cd },
    successCallback: function (url) {
      debugger
    }
  })
}

function save() {
  if (!checkRate($('#rw_w').val())) {
    alert('退水量需要为数字')
    return
  }
  if (!checkRate($('#irr_a').val())) {
    alert('灌溉面积及用水规模需要为数字')
    return
  }
  if (!checkRate($('#ww').val())) {
    alert('申请水量需要为数字')
    return
  }

  if (!validNull()) {
    return
  }

  const pdata = {
    id: id,
    fileids: fileIds
  }

  for (const i in $('#table :input')) {
    if (isNaN(parseInt(i))) {
      continue
    }
    const item = $('#table :input')[i]
    pdata[item.id.toLowerCase()] = $(item).val()
  }

  pdata.type_id = $('#type_id').getSelected().ids[0]
  pdata.type_tm = $('#choose_tm').val()
  if ($('#type_id').getSelected().vals[0] !== '') {
    pdata.type_tm = $('#type_id').getSelected().vals[0].split(' ')[1]
  }

  if (pdata.type_tm === '') {
    alert('请填写 取水许可管理动态信息 时间')
    return
  }

  let url = 'spgc/updateWpcWF'
  let reqType = 'PUT'
  // 管理动态信息为"发证申请"转交到新批未发
  if (id && pdata.type_id === '10') {
    url = 'spgc/transWpcWFtoM'
    reqType = 'PUT'

    // 此处需求需要设置为一个取水户
    pdata.wiu_cd = wiu_obj.wiu_cd
    pdata.wrp_nm = wiu_obj.wiu_nm
  }

  if (fileIds && fileIds.length > 0) {
    pdata.fileids = fileIds
  }

  $.ajax({
    url: basePath + url,
    type: reqType,
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      parent.maketable()
      parent.layer.closeAll()
    }
  })
}

function checkRate(number) {
  if (number === '' || number === null) {
    return true
  }

  const re = /^[0-9]+.?[0-9]+$/
  if (!re.test(number)) {
    return false
  }
  return true
}

function cancel() {
  parent.layer.closeAll()
}

//
var wiu_obj = {
  wiu_cd: '',
  wiu_nm: ''
}

function setWrp_nm(wiu_nm) {
  $('#wrp_nm').val(wiu_nm)
}

function wiuPage() {
  layer.open({
    type: 2,
    title: '取水户',
    shadeClose: false,
    shade: 0.2,
    maxmin: false, //开启最大化最小化按钮
    area: ['600px', '450px'],
    content: basePath + 'pages/rcgl/spgcgl/xpwf/dialog/wiu.jsp'
  })
}

// 校验
let datas = [
  { apply_nm: '申请人' },
  { ad_nm: '行政区' },
  { wrz_nm: '水资源分区' },
  { th_level: '三级分区' },
  { int_nm: '取水口' },
  { int_addr_d: '取水口所在地' },
  // {int_addr_lgtd:'取水口经度'},{int_addr_lttd:'取水口纬度'},
  { chk_int_met: '取水方式' },
  { wf_nm: '取水水源' },
  { ww: '申请水量' },
  { int_use: '取水用途' },
  { max_q: '取水工程最大流量' },
  // {irr_a:'灌溉面积及用水规模'},
  // {rw_addr:'退水地点'},{rw_addr_lgtd:'退水口经度'},{rw_addr_lgtd:'退水口纬度'},
  { deter_tm: '取水许可决定时间' }
]
// 制证
const typeZZ = [{ wpc_sn: '取水许可证编号' }, { wrp_nm: '取水权人' }]

function isNull(str) {
  if (str === null || str === '' || str === undefined) {
    return true
  }
  return false
}

function validNull() {
  let res = true

  if ($('#type_id').val() === '10') {
    datas = datas.concat(typeZZ)
  }

  for (const i in datas) {
    let flag = false
    const item = datas[i]
    for (const k in item) {
      if (isNull($('#' + k).val())) {
        flag = true
        res = false
        alert(item[k] + '不能为空')
        break
      }
    }
    if (flag) {
      break
    }
  }

  return res
}

function initTips() {
  $('#table :input').each(function (idx, item) {
    $(item).mouseenter(function (e) {
      tips(e.target)
    })

    $(item).mouseout(function (e) {
      layer.close(tipid)
    })
  })
}

let tipid
function tips(target) {
  if (!$(target).attr('tip')) {
    return
  }

  tipid = layer.tips($(target).attr('tip'), target, {
    tips: [1, '#3595CC'],
    time: 2000
  })
}

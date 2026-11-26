let ptype = 'update'
$(document).ready(function () {
  if (wpc_cd === null || wpc_cd === 'null' || wpc_cd === undefined || wpc_cd === '') {
    wpc_cd = ''
    ptype = 'add'
  }

  initData()
  addInfo()
})

function initData() {
  if (wpc_cd && wpc_cd != 'null') {
    $.ajax({
      type: 'GET',
      url: basePath + 'qsys/getWSYSInfo?wpc_cd=' + wpc_cd + '&year=' + year,
      contentType: 'application/json',
      async: true,
      success: function (data) {
        if (data && data.length > 0) {
          const row = data[0]
          for (const k in row) {
            $('#' + k).val(row[k])
          }
          const wpc_sn = row.wpc_sn

          setOption(data)
        }
      }
    })
    $.ajax({
      type: 'GET',
      url: basePath + 'qsys/getQSYS?wpc_cd=' + wpc_cd,
      contentType: 'application/json',
      async: true,
      success: function (data) {
        const zfill = function (num, fill) {
          const len = ('' + num).length
          return Array(fill > len ? fill - len + 1 || 0 : 0).join(0) + num
        }
        const set = function (year, type, list) {
          for (let i = 0; i < list.length; ++i) {
            const date = year + '-' + zfill(i + 1, 2)
            const item = document.getElementById(type + '|' + date)
            $(item).val(list[i])
          }
        }
        for (const year in data) {
          set(year, 'act_prod', data[year].act_prod)
          set(year, 'act_ww_g', data[year].act_ww_g)
          set(year, 'act_ww_s', data[year].act_ww_s)
          set(year, 'app_ww_g', data[year].app_ww_g)
          set(year, 'app_ww_s', data[year].app_ww_s)
          set(year, 'des_scal', data[year].des_scal)
          set(year, 'prod_effi', data[year].prod_effi)
          set(year, 'rep_ww_g', data[year].rep_ww_g)
          set(year, 'rep_ww_s', data[year].rep_ww_s)
          $(document.getElementById('ww_s|' + year)).val(data[year].ww_s)
          $(document.getElementById('ww_g|' + year)).val(data[year].ww_g)
        }
      }
    })
  }
}

//
function saveInfo() {
  const json = {}
  json.wpc_cd = wpc_cd
  json.year = year
  json.prj_nm = $('#prj_nm').val()
  json.wpc_sn = $('#wpc_sn').val()
  json.wrp_nm = $('#wrp_nm').val()
  json.lr_nm = $('#lr_nm').val()
  json.draw_staff = $('#draw_staff').val()
  json.draw_tel = $('#draw_tel').val()

  const infos = $('#type_id').getInfos()
  const seltype = $('#type_id').getSelected()

  if (seltype && seltype.hasOwnProperty('ids')) {
    json.typeid = seltype.ids[0]
    const timeList = []
    for (const i in options) {
      const item = options[i]
      timeList.push(infos[item.id])
    }
    json.typetimes = timeList.toString()
  }

  $.ajax({
    url: basePath + 'qsys/saveQSYSInfo',
    type: 'POST',
    data: JSON.stringify(json),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {}
  })
}

function save() {
  saveInfo()
  calcYear()

  const resole = getResole()
  const pdata = []

  for (const k in resole) {
    const json = {}
    json.year = k
    json.wpc_cd = wpc_cd
    for (const j in resole[k]) {
      json[j] = resole[k][j]
    }
    pdata.push(json)
  }

  $.ajax({
    url: basePath + 'qsys/saveQSYS',
    type: 'POST',
    data: JSON.stringify(pdata),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      parent.search()
      parent.layer.closeAll()
    }
  })
}

function getResole() {
  const inputs = $('#table input')
  const resole = {}
  const prefix = [
    'des_scal',
    'act_prod',
    'prod_effi',
    'app_ww_s',
    'app_ww_g',
    'rep_ww_s',
    'rep_ww_g',
    'act_ww_s',
    'act_ww_g'
  ]
  const pww = ['ww_s', 'ww_g']
  for (let i = 0; i < inputs.length; ++i) {
    const r = $('#table input')[i]
    if (r.id && prefix.indexOf(r.id.split('|')[0]) >= 0) {
      var pr = r.id.split('|')[0]
      const date = r.id.split('|')[1]
      var year = date.split('-')[0]
      if (!resole.hasOwnProperty(year)) {
        resole[year] = {}
        resole[year][pr] = [r.value]
      } else if (!resole[year].hasOwnProperty(pr)) {
        resole[year][pr] = [r.value]
      } else {
        resole[year][pr].push(r.value)
      }
    } else if (r.id && pww.indexOf(r.id.split('|')[0]) >= 0) {
      var pr = r.id.split('|')[0]
      var year = r.id.split('|')[1]
      if (!resole.hasOwnProperty(year)) {
        resole[year] = {}
        resole[year][pr] = r.value
      } else {
        resole[year][pr] = r.value
      }
    }
  }

  return resole
}

function calcYear() {
  const resole = getResole()
  const prefix = [
    'des_scal',
    'act_prod',
    'prod_effi',
    'app_ww_s',
    'app_ww_g',
    'rep_ww_s',
    'rep_ww_g',
    'act_ww_s',
    'act_ww_g'
  ]

  // 计算每年的和
  for (const year in resole) {
    const item = resole[year]
    let sum = 0
    for (const k in prefix) {
      const pk = prefix[k]
      for (let i = 0; i < 12; ++i) {
        if (isStrEmpty(item[pk][i])) {
          continue
        } else {
          sum += Number(item[pk][i])
        }
      }
      // 赋值 和
      if (sum !== 0) {
        item[pk][12] = '' + sum
        $(document.getElementById(pk + '|' + year + '-13')).val(sum)
        sum = 0
      } else {
        item[pk][12] = ''
        $(document.getElementById(pk + '|' + year + '-13')).val('')
      }
    }
  }
}

function cancel() {
  parent.layer.closeAll()
}

let calYear = year
let idx = 1
function addInfo() {
  if (calYear === '') {
    calYear = parseInt(moment().format('YYYY'))
  } else {
    calYear = parseInt(year)
  }

  genTableTemp(idx, calYear)
  ++idx
  --calYear
}

var options = [
  { id: '01', name: '接收材料' },
  { id: '02', name: '审查' },
  { id: '03', name: '计划批复' },
  { id: '04', name: '结束' }
]

function setOption(data) {
  const type_id = data[0].typeid
  const type_times = data[0].typetimes.split(',')
  const type_no = parseInt(type_id) - 1

  const infos = {}
  for (let i = 1; i < type_times.length + 1; ++i) {
    infos['0' + i] = type_times[i - 1]
  }

  if (type_id) {
    $('#choose_tm').val(type_times[type_no])
    const item = $('#type_id').getItemById(options, type_id)
    $('#type_id').val(item.name + ' ' + type_times[type_no])
    $('#type_id').cusSelect(options, [type_id], true, infos, ckInfo)
  }
}

// 点击修改时间
let sids
function ckInfo(id, e) {
  //var sids = $('#type_id').getSelected().ids;
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

$(function () {
  //屏幕大小改变自动刷新页面
  //	window.onresize = function () {window.location.reload();}
  //页面顶部导航栏点击事件
  $('.top_menu li').click(function () {
    $('.top_menu li').each(function () {
      $(this).css('background-color', '')
      $(this).css('font-weight', '100')
      $(this).children().css('color', '#FFFFFF')
      $(this).css('border-bottom', '0px')
    })
    //		$(this).css("background-color","white");
    //		$(this).children().css("color","#0056C0");
    $(this).css('font-weight', 'bold')
    $(this).css('border-bottom', '3px solid #32d4d2')
    $(this).css('background-color', 'rgba(0, 35, 100, 0.2)')
    const id = $(this).attr('id')
    $(".body_left ul[class='left_url']").css('display', 'none')
    //点击顶部导航栏，默认选中该模块内第一个子模块
    if (id == 'kfly') {
      $('.body_left').children("ul[id='kfly_ul']").css('display', 'block')
      $(".body_left li[id='jsl']").click()
    } else if (id == 'jyys') {
      $('.body_left').children("ul[id='jyys_ul']").css('display', 'block')
      $(".body_left li[id='qsjh']").click()
    } else if (id == 'szybh') {
      $('.body_left').children("ul[id='szybh_ul']").css('display', 'block')
      //			$(".body_left li[id='lygk']").click();
      $(".body_left li[id='sgnq']").click()
    } else if (id == 'szybhgl') {
      $('.body_left').children("ul[id='szybhgl_ul']").css('display', 'block')
      //			$(".body_left li[id='lygk']").click();
      $(".body_left li[id='szybhglsy']").click()
    } else if (id == 'lyzg') {
      $('.body_left').children("ul[id='lyzg_ul']").css('display', 'block')
      $(".body_left li[id='zgsyd']").click()
    } else if (id == 'rcgl') {
      $('.body_left').children("ul[id='rcgl_ul']").css('display', 'block')
      $(".body_left li[id='rcgl_spgcgl']").click()
    } else if (id == 'jyys_new') {
      $('.body_left').children("ul[id='jyys_new_ul']").css('display', 'block')
      $(".body_left li[id='jssy']").click()
    }

    //本地先屏蔽掉
    jQuery.getJSON(
      basePath + 'rcgl/logtag/getCasUserRole',
      { nowtime: Math.random() },
      function (result) {
        if (result != null) {
          for (let i = 0; i < result.length; i++) {
            const roleCode = result[i].ROLE_CODE
            if ('hwwr-03' == roleCode || 'hwwr-02' == roleCode) {
              $('#rcgl').css('display', '')
            }

            if ('hwwr-01' == roleCode) {
              $('#rcgl').css('display', '')
              $('#lyzg_log').css('display', '')
            }
          }
        }
      }
    )
    const roleCode = request.getRemoteUser()
    console.log('dssroleCode() ', roleCode)

    //		jQuery.getJSON(basePath+"user/getCasUser",{"nowtime":Math.random()},function(result){
    //
    //			if(result!=null){
    //				for(var i=0;i<result.length;i++){
    //					var roleCode=result[i]["USERCODE"];
    //					if("370902199001104829"==roleCode){
    //						debugger;
    //						$("#rcgl").css("display","none");
    //						$("#kfly").css("display","none");
    //						$("#szybh").css("display","none");
    //						$("#lyzg").css("display","none");
    //					}
    //					if("210423197303210425"==roleCode||"350121198004136735"==roleCode
    //							||"370902199001104829"==roleCode||"210882198310031229"==roleCode
    //							||"13020319811118331X"==roleCode||"130924199402273213"==roleCode
    //							||"230208199404300428"==roleCode){
    //						$("#szybhgl").css("display","block");
    //					}
    //
    //				/*	if("hwwr-01"==roleCode){
    //						$("#rcgl").css("display","");
    //						$("#lyzg_log").css("display","");
    //					}*/
    //				}
    //
    //			}
    //		});
  })
  /**
   * 左侧二级菜单鼠标事件
   */
  $('.body_left li').mouseover(function () {
    const back_color = $(this).css('background-color')
    if (back_color == 'rgba(0, 0, 0, 0)' || back_color == 'transparent') {
      //			$(this).css("background-color","#EFEFEF");
      $(this).find('span').css('font-weight', '600')
      $(this).find('span').css('color', '#237bff')
      $(this).find("div[class='triangle-facing-right']").css('display', 'block')
    }
    $('.child_menu_div li').css('background-color', '#FFFFFF')
    $(this).children("div[class='child_menu_div']").css('display', 'block')
    const ulh = $(this).children("div[class='child_menu_div']").find('ul').css('height')
    const th = (parseInt(ulh) - 15) / 2
    $(this).find("div[class='triangle-facing-left']").css('top', th)
    $('.child_menu_div li').each(function () {
      $(this).find('span').css('font-weight', '500')
    })
  })
  $('.body_left li').mouseout(function () {
    $(this).find('span').css('font-weight', '')
    $(this).find('span').css('color', '#43536a')
    const imgurl = $(this).find('img').attr('src')
    if (imgurl != null && imgurl.indexOf('-01') > 0) {
      $(this).css('background-color', '')
      $(this).find("div[class='triangle-facing-right']").css('display', 'none')
    }
    $(this).children("div[class='child_menu_div']").css('display', 'none')
  })
  //页面左侧菜单点击事件
  $('.body_left li').click(function () {
    $('.triangle-facing-left').css('display', 'none')
    $('.body_left li').each(function () {
      const id = $(this).attr('id')
      let url = basePath + 'images/index/'
      let tpnm = ''
      if (id == 'jsl') {
        tpnm = 'jsl-01.png'
      } else if (id == 'szyl') {
        tpnm = 'szyl-01.png'
      } else if (id == 'crjsl') {
        tpnm = 'crjsl-01.png'
      } else if (id == 'skxsl') {
        tpnm = 'skxsl-01.png'
      } else if (id == 'gsl') {
        tpnm = 'gsl-01.png'
      } else if (id == 'ysl') {
        tpnm = 'ysl-01.png'
      } else if (id == 'hsl') {
        tpnm = 'hsl-01.png'
      } else if (id == 'psl') {
        tpnm = 'psl-01.png'
      } else if (id == 'qsxk') {
        tpnm = 'qsxk-01.png'
      } else if (id == 'qsjh') {
        tpnm = 'qsjh-01.png'
      } else if (id == 'ysxl') {
        tpnm = 'ysxl-01.png'
      } else if (id == 'yswdgl') {
        tpnm = 'ysxl-01.png'
      } else if (id == 'jsjg') {
        tpnm = 'ysxl-01.png'
      } else if (id == 'xyjssh') {
        tpnm = 'ysxl-01.png'
      } else if (id == 'jsztjs') {
        tpnm = 'ysxl-01.png'
      } else if (id == 'sstwmjs') {
        tpnm = 'ysxl-01.png'
      } //水生态文明建设
      else if (id == 'sgnq') {
        tpnm = 'sgnq-01.png'
      } else if (id == 'rhpwk') {
        tpnm = 'rhpwk-01.png'
      } else if (id == 'yysyd') {
        tpnm = 'yysyd-01.png'
      } else if (id == 'szybh_sjdm') {
        tpnm = 'szz-01.png'
      } else if (id == 'szybh_szzd') {
        tpnm = 'szzdz-01.png'
      } else if (id == 'zdhhpg') {
        tpnm = 'szzdz-01.png'
      } else if (id == 'qxjdm') {
        tpnm = 'qsxk-01.png'
      } else if (id == 'zgsyd') {
        tpnm = 'zgsyd-01.png'
      } else if (id == 'zgsgnq') {
        tpnm = 'zgsgnq-01.png'
      } else if (id == 'lyzg_sjdm') {
        tpnm = 'sjszdm-01.png'
      } else if (id == 'lyzg_yyssyd') {
        tpnm = 'qsxk-01.png'
      } else if (id == 'lyzg_swllz') {
        tpnm = 'swllz-01.png'
      } else if (id == 'lyzg_ldswz') {
        tpnm = 'ldswz-01.png'
      } else if (id == 'lyzg_szzdz') {
        tpnm = 'szzdz-01.png'
      } else if (id == 'lyzg_zysjtj') {
        tpnm = 'zysjtj-01.png'
      } else if (id == 'lyzg_zlxx') {
        tpnm = 'zlxx-01.png'
      } else if (id == 'lyzg_szygb') {
        tpnm = 'szygb-01.png'
      } else if (id == 'lyzg_szynb') {
        tpnm = 'szynb-01.png'
      } else if (id == 'lyzg_sthx') {
        tpnm = 'szynb-01.png'
      } else if (id == 'lyzg_flfg') {
        tpnm = 'szynb-01.png'
      } else if (id == 'lyzg_jdjc') {
        tpnm = 'szynb-01.png'
      } else if (id == 'lyzg_expert') {
        tpnm = 'szynb-01.png'
      } else if (id == 'lyzg_log') {
        tpnm = 'szynb-01.png'
      }
      //
      else if (id == 'rcgl_spgcgl') {
        tpnm = 'spgcgl-01.png'
      } else if (id == 'rcgl_wfzgl') {
        tpnm = 'szyl-01.png'
      } else if (id == 'rcgl_ssfzgl') {
        tpnm = 'szyl-01.png'
      } else if (id == 'rcgl_llfztj') {
        tpnm = 'szyl-01.png'
      } else if (id == 'rcgl_dsgl') {
        tpnm = 'dsgl-01.png'
      }

      //节水模块
      else if (id == 'jssy') {
        tpnm = 'jssy-01.png'
      } //首页
      else if (id == 'jsxw') {
        tpnm = 'jsxw-01.png'
      } else if (id == 'lygk') {
        tpnm = 'lygk-01.png'
      } else if (id == 'sjzl') {
        tpnm = 'jsxw-01.png'
      } //数据资料
      else if (id == 'zcfg') {
        tpnm = 'zcfg-01.png'
      } else if (id == 'tzwj') {
        tpnm = 'tzwj-01.png'
      } else if (id == 'gzdt') {
        tpnm = 'gzdt-01.png'
      } else if (id == 'ywsj') {
        tpnm = 'ywsj-01.png'
      } else if (id == 'ztyj') {
        tpnm = 'ztyj-01.png'
      } else if (id == 'zlk') {
        tpnm = 'zlk-01.png'
      } else if (id == 'xwdt') {
        tpnm = 'water-01.png'
      } else if (id == 'ywgz') {
        tpnm = 'ztyj-01.png'
      } else if (id == 'sjtb') {
        tpnm = 'tzwj-01.png'
      } else if (id == 'szybhglsy') {
        tpnm = 'jssy-01.png'
      } //首页

      url += tpnm
      $(this).find('img').attr('src', url)
    })
    $(this).find("div[class='triangle-facing-right']").css('display', 'none')
    $('.body_left li').css('color', '#43536a')
    $('.body_left li').css('border-right', '0')
    //		$(this).css("background-color","#EFEFEF");
    $(this).css('color', '#237bff')
    $(this).css('border-right', '3px solid #237bff')
    $(this).find('span:first').css('font-weight', '600')
    const id = $(this).attr('id')
    let url = basePath + 'images/index/'
    let tpnm = ''
    if (id == 'jsl') {
      tpnm = 'jsl-02.png'
    } else if (id == 'szyl') {
      tpnm = 'szyl-02.png'
    } else if (id == 'crjsl') {
      tpnm = 'crjsl-02.png'
    } else if (id == 'skxsl') {
      tpnm = 'skxsl-02.png'
    } else if (id == 'gsl') {
      tpnm = 'gsl-02.png'
    } else if (id == 'ysl') {
      tpnm = 'ysl-02.png'
    } else if (id == 'hsl') {
      tpnm = 'hsl-02.png'
    } else if (id == 'psl') {
      tpnm = 'psl-02.png'
    } else if (id == 'qsxk') {
      tpnm = 'qsxk-02.png'
    } else if (id == 'qsjh') {
      tpnm = 'qsjh-02.png'
    } else if (id == 'ysxl') {
      tpnm = 'ysxl-02.png'
    } else if (id == 'yswdgl') {
      tpnm = 'ysxl-02.png'
    } else if (id == 'jsjg') {
      tpnm = 'ysxl-02.png'
    } else if (id == 'xyjssh') {
      tpnm = 'ysxl-02.png'
    } else if (id == 'jsztjs') {
      tpnm = 'ysxl-02.png'
    } else if (id == 'sstwmjs') {
      tpnm = 'ysxl-02.png'
    } //水生态文明建设
    else if (id == 'sgnq') {
      tpnm = 'sgnq-02.png'
    } else if (id == 'rhpwk') {
      tpnm = 'rhpwk-02.png'
    } else if (id == 'yysyd') {
      tpnm = 'yysyd-02.png'
    } else if (id == 'szybh_sjdm') {
      tpnm = 'szz-02.png'
    } else if (id == 'szybh_szzd') {
      tpnm = 'szzdz-02.png'
    } else if (id == 'zdhhpg') {
      tpnm = 'szzdz-02.png'
    } else if (id == 'qxjdm') {
      tpnm = 'qsxk-02.png'
    } else if (id == 'zgsyd') {
      tpnm = 'zgsyd-02.png'
    } else if (id == 'zgsgnq') {
      tpnm = 'zgsgnq-02.png'
    } else if (id == 'lyzg_sjdm') {
      tpnm = 'sjszdm-02.png'
    } else if (id == 'lyzg_yyssyd') {
      tpnm = 'qsxk-02.png'
    } else if (id == 'lyzg_swllz') {
      tpnm = 'swllz-02.png'
    } else if (id == 'lyzg_ldswz') {
      tpnm = 'ldswz-02.png'
    } else if (id == 'lyzg_szzdz') {
      tpnm = 'szzdz-02.png'
    } else if (id == 'lyzg_zysjtj') {
      tpnm = 'zysjtj-02.png'
    } else if (id == 'lyzg_zlxx') {
      tpnm = 'zlxx-02.png'
    } else if (id == 'lyzg_szygb') {
      tpnm = 'szygb-02.png'
    } else if (id == 'lyzg_szynb') {
      tpnm = 'szynb-02.png'
    } else if (id == 'lyzg_sthx') {
      tpnm = 'szynb-02.png'
    } else if (id == 'lyzg_flfg') {
      tpnm = 'szynb-02.png'
    } else if (id == 'lyzg_jdjc') {
      tpnm = 'szynb-02.png'
    } else if (id == 'lyzg_expert') {
      tpnm = 'szynb-02.png'
    } else if (id == 'lyzg_log') {
      tpnm = 'szynb-02.png'
    }
    //
    else if (id == 'rcgl_spgcgl') {
      tpnm = 'spgcgl-02.png'
    } else if (id == 'rcgl_wfzgl') {
      tpnm = 'szyl-02.png'
    } else if (id == 'rcgl_ssfzgl') {
      tpnm = 'szyl-02.png'
    } else if (id == 'rcgl_llfztj') {
      tpnm = 'szyl-02.png'
    } else if (id == 'rcgl_dsgl') {
      tpnm = 'dsgl-02.png'
    }

    //节水模块
    else if (id == 'jssy') {
      tpnm = 'jssy-02.png'
    } else if (id == 'jsxw') {
      tpnm = 'jsxw-02.png'
    } else if (id == 'lygk') {
      tpnm = 'lygk-02.png'
    } else if (id == 'sjzl') {
      tpnm = 'jsxw-02.png'
    } else if (id == 'zcfg') {
      tpnm = 'zcfg-02.png'
    } else if (id == 'tzwj') {
      tpnm = 'tzwj-02.png'
    } else if (id == 'gzdt') {
      tpnm = 'gzdt-02.png'
    } else if (id == 'ywsj') {
      tpnm = 'ywsj-02.png'
    } else if (id == 'ztyj') {
      tpnm = 'ztyj-02.png'
    } else if (id == 'zlk') {
      tpnm = 'zlk-02.png'
    } else if (id == 'xwdt') {
      tpnm = 'water-02.png'
    } else if (id == 'ywgz') {
      tpnm = 'ztyj-02.png'
    } else if (id == 'sjtb') {
      tpnm = 'tzwj-02.png'
    } else if (id == 'szybhglsy') {
      tpnm = 'jssy-02.png'
    }

    url += tpnm
    $(this).find('img').attr('src', url)
    /*$(this).find("div[class='child_menu_div']").find("div[class='triangle-facing-left']").css("display","block"); */ // 隐去二级菜单里的小括号
  })
  /**
   * 三级菜单鼠标事件
   */
  $('.child_menu_div li').mouseover(function () {
    $(this).find('span').css('background-color', '#17BDB0')
    $(this).find('span').css('color', '#FFFFFF')
  })
  $('.child_menu_div li').mouseout(function () {
    $(this).find('span').css('background-color', '#FFFFFF')
    $(this).find('span').css('color', 'black')
  })
  //菜单链接地址
  $('.body_left li').click(function () {
    let url = basePath
    const id = $(this).attr('id')
    if (id == 'jsl') {
      url += 'pages/kfly/jsl/tab.jsp'
    } //降水量
    //		else if(id=="szyl"){url+="pages/message/gb/06/szyzl.jsp";}		//水资源量
    else if (id == 'dbs') {
      url += 'pages/kfly/szyl/dbs/dbs.jsp'
    } //水资地表水量
    else if (id == 'szyl_dxs') {
      url += 'pages/kfly/szyl/dxs/dxs.jsp'
    } //水资地下水量
    else if (id == 'szyzl') {
      url += 'pages/kfly/szyl/szyzl/szyzl.jsp'
    } //水资源总量
    else if (id == 'crjsl') {
      url += 'pages/kfly/crjsl/crjslMap.jsp'
    } //出入境水量
    else if (id == 'skxsl') {
      url += 'pages/kfly/skxsl/tab.jsp'
    } //水库蓄水量
    else if (id == 'nsbd') {
      url += 'pages/kfly/gsl/nsbd/nsbdMap.jsp'
    } //南水北调
    else if (id == 'dxs') {
      url += 'pages/kfly/gsl/dxs/dxs.jsp'
    } //地下水
    else if (id == 'gsfx') {
      url += 'pages/kfly/gsl/gsfx/gsfx.jsp'
    } //供水分析
    else if (id == 'qysjc') {
      url += 'pages/kfly/ysl/qysjc/qysjcTab.jsp'
    } //取用水监测
    else if (id == 'ysfx') {
      url += 'pages/kfly/ysl/ysfx/ysl.jsp'
    } //用水分析
    else if (id == 'ETjc') {
      url += 'pages/kfly/hsl/ET/et.jsp'
    } //ET监测
    else if (id == 'hsfx') {
      url += 'pages/kfly/hsl/hsfx/hsl.jsp'
    } //耗水分析
    else if (id == 'psl') {
      url += 'pages/kfly/psl/pwl.jsp'
    } //排水量
    else if (id == 'szylz') {
      url += 'pages/kfly/qsxk/szylz/szylz.jsp'
    } //水资源论证
    else if (id == 'qsxkl') {
      url += 'pages/kfly/qsxk/qsxk/tab.jsp'
    } //取水许可
    else if (id == 'szyfzssy') {
      url += 'pages/kfly/qsxk/zssy/tjxx/wfsttm.jsp'
    } //水资源费征收使用
    else if (id == 'qsjh') {
      url += 'pages/jyys/qsjh/tab.jsp'
    } //取水计划
    else if (id == 'ysxl') {
      url += 'pages/jyys/ysxl/tab.jsp'
    } //用水效率
    else if (id == 'yswdgl') {
      url += 'pages/jyys/ysFile/fafile.jsp'
    } //文档管理
    else if (id == 'jsjg') {
      url += 'pages/message/nb/11/jsjg.jsp'
    } // 节水技改
    else if (id == 'xyjssh') {
      url += 'pages/message/nb/12/xyjssh.jsp'
    } // 县域节水
    else if (id == 'jsztjs') {
      url += 'pages/message/nb/13/jsztjs.jsp'
    } // 节水载体
    else if (id == 'sstwmjs') {
      url += 'pages/jyys/sstwmjs/fafile.jsp'
    } // 水生态文明建设
    else if (id == 'sgnq') {
      url += 'pages/szybh/sgnq/sgnqTab.jsp'
    } //水功能区
    else if (id == 'rhpwk') {
      url += 'pages/szybh/rhpwk/rhpwkMap.jsp'
    } //入河排污口
    else if (id == 'yysyd') {
      url += 'pages/szybh/yysyd/fzg/fzgsyd.jsp'
    } //饮用水源地
    else if (id == 'szybh_sjdm') {
      url += 'pages/szybh/sjdm/tab.jsp'
    } //水资源保护省界断面人工水质站
    else if (id == 'szybh_szzd') {
      url += 'pages/szybh/sjdm/sjdm_szzd/sjdm_szzdz.jsp'
    } //水资源保护省界断面水质自动站
    else if (id == 'zdhhpg') {
      url += 'pages/szybh/rvlkappraise/rvlkappraise.jsp'
    } //重点河湖评估
    else if (id == 'qxjdm') {
      url += ''
    } //区县界断面
    else if (id == 'zgsyd') {
      url += 'pages/lyzg/yyssyd/zg/yysyd.jsp'
    } //直管水源地
    else if (id == 'zgsgnq') {
      url += 'pages/lyzg/zgsgnq/zgsgnqMap.jsp'
    } //直管水功能区
    else if (id == 'lyzg_sjdm') {
      url += 'pages/lyzg/sjdm/sjdm_index.jsp'
    } //流域直管省界断面
    //		else if(id=="lyzg_yyssyd"){url+="pages/lyzg/yyssyd/zg/yysyd.jsp";}	//流域直管饮用水水源地
    else if (id == 'lyzg_swllz') {
      url += 'pages/lyzg/swllz/swllz.jsp'
    } //流域直管水位流量站
    else if (id == 'lyzg_ldswz') {
      url += '/pages/lyzg/ldswz/ldswz.jsp'
    } //流域直管雷达水位站
    else if (id == 'lyzg_szzdz') {
      url += '/pages/lyzg/szzdz/szzdz.jsp'
    } //流域直管水质自动站
    //else if(id=="lyzg_zysjtj"){url+="/pages/lyzg/zysjtj/zysjtj.jsp";} //中央数据统计
    else if (id == 'lyzg_zysjtj') {
      url += '/pages/lyzg/zysjtj/sjtj.jsp'
    } //中央数据统计
    else if (id == 'lyzg_zlxx') {
      url += '/pages/lyzg/zlxx_new/zlxx.jsp'
    } //资料信息
    else if (id == 'lyzg_szygb') {
      url += '/pages/rcgl/szygb/gb.jsp'
    } // 水资源公报
    else if (id == 'lyzg_szynb') {
      url += '/pages/lyzg/szynb/szynb.jsp'
    } // 水资源年报
    else if (id == 'lyzg_sthx') {
      url += 'pages/rcgl/sthx/tab.jsp'
    } //三条红线
    else if (id == 'lyzg_flfg') {
      url += 'pages/rcgl/flfg/flfg.jsp'
    } // 法律法规
    else if (id == 'lyzg_jdjc') {
      url += 'pages/rcgl/jdjc/jdjcTab.jsp'
    } // 监督检查
    else if (id == 'lyzg_expert') {
      url += 'pages/rcgl/expert/expertManage.jsp'
    } // 专家库
    else if (id == 'lyzg_log') {
      url += 'pages/rcgl/log/logList.jsp'
    } // 日志
    //
    else if (id == 'rcgl_spgcgl') {
      url += 'pages/rcgl/spgcgl/tab.jsp'
    } // 审批过程管理
    else if (id == 'rcgl_wfzgl') {
      url += '/pages/rcgl/wfzgl/tab.jsp'
    } // 委发证管理
    else if (id == 'rcgl_ssfzgl') {
      url += '/pages/rcgl/ssfzgl/tab.jsp'
    } // 省市发证管理
    else if (id == 'rcgl_llfztj') {
      url += '/pages/rcgl/llfztj/lyfztj.jsp'
    } // 流域发证统计
    else if (id == 'rcgl_dsgl') {
      url += '/pages/nsbd/nsbdMap.jsp'
    } // 省市发证管理
    else if (id == 'jssy') {
      url += 'pages/jyys_new/sy/sy.jsp'
    } //首页
    else if (id == 'jsxw') {
      url += 'pages/jyys_new/jsxw/tab.jsp'
    } //节水新闻
    else if (id == 'txl') {
      url += 'pages/jyys_new/lygk/txl/txl.jsp'
    } ///流域概况--通讯录
    else if (id == 'zjk') {
      url += 'pages/jyys_new/lygk/zjk/zjk.jsp'
    } //流域概况--专家库
    else if (id == 'xwtj') {
      url += 'pages/jyys_new/lygk/xwtj/xwtj.jsp'
    } //流域概况--新闻统计
    else if (id == 'gzzn') {
      url += 'pages/jyys_new/lygk/gzzn/gzzn.jsp'
    } //流域概况--工作职能
    /*else if(id=='jsgk'){url+="pages/jyys_new/lygk/jsgk/jsgk.jsp";}//流域概况--节水概况*/
    else if (id == 'zcfg') {
      url += 'pages/jyys_new/zcfg/zcfg.jsp'
    } //政策法规
    else if (id == 'tzwj') {
      url += 'pages/jyys_new/tzwj/tzwj.jsp'
    } //通知文件
    else if (id == 'gzdt') {
      url += 'pages/jyys_new/gzdt/gzdt.jsp'
    } //工作动态
    else if (id == 'xydb') {
      url += 'pages/jyys_new/ywsj/xydb/tab.jsp'
    } //业务数据--县域达标
    else if (id == 'ysde') {
      url += 'pages/jyys_new/ywsj/ysde/tab.jsp'
    } //业务数据--用水定额
    else if (id == 'jhys') {
      url += 'pages/jyys_new/ywsj/jhys/tab.jsp'
    } //业务数据--计划用水
    else if (id == 'zdjkysdw') {
      url += 'pages/jyys_new/ywsj/zdjkysdw/tab.jsp'
    } //业务数据--重点监控用水单位
    else if (id == 'jspj') {
      url += 'pages/jyys_new/ywsj/jspj/tab.jsp'
    } //业务数据--节水评价
    else if (id == 'jskh') {
      url += 'pages/jyys_new/ywsj/jskh/tab.jsp'
    } //业务数据--节水考核
    else if (id == 'jsztjstj') {
      url += 'pages/jyys_new/ywsj/jsztjs/tab.jsp'
    } //业务数据--节水载体建设（统计）
    else if (id == 'ztyj') {
      url += 'pages/jyys_new/ztyj/tab.jsp'
    } //专题研究
    else if (id == 'zlk') {
      url += 'pages/jyys_new/zlk/zlk.jsp'
    } //资料库
    else if (id == 'szybhgk') {
      url += 'pages/szybh/lygk/waterProtect.jsp'
    } //水资源保护--流域概况--水资源保护概况
    else if (id == 'gzzn2') {
      url += 'pages/szybh/lygk/workfunction/workfunction.jsp'
    } //水资源保护--流域概况--工作职能
    else if (id == 'jgsz') {
      url += 'pages/szybh/lygk/departSet/departSet.jsp'
    } //水资源保护--流域概况--机构设置
    else if (id == 'txl2') {
      url += 'pages/szybh/lygk/addressBook/addressBook.jsp'
    } //水资源保护--流域概况--通讯录
    else if (id == 'xwdt') {
      url += 'pages/szybh/lygk/newInfo/newsInfo.jsp'
    } //水资源保护--新闻动态
    else if (id == 'zjk2') {
      url += 'pages/szybh/sjzl/expert_js/expertManage.jsp'
    } //水资源保护--数据资料-专家库
    else if (id == 'tpk') {
      url += 'pages/szybh/sjzl/picture/picManage.jsp'
    } //水资源保护--数据资料-图片库
    else if (id == 'flfgbz') {
      url += 'pages/szybh/sjzl/law_file/lawTab.jsp'
    } //水资源保护--数据资料-法律法规标准规范
    else if (id == 'wjzl') {
      url += 'pages/szybh/sjzl/wjzl/wjzl.jsp'
    } //水资源保护--数据资料-文件资料
    else if (id == 'dsj') {
      url += 'pages/szybh/sjzl/bignote/bignote.jsp'
    } //水资源保护--数据资料-大事记
    else if (id == 'xmgl') {
      url += 'pages/szybh/sjzl/projectManage/projectManage.jsp'
    } //水资源保护--数据资料-项目管理
    else if (id == 'stllgk') {
      url += 'pages/szybh/ywgz/ecologyFlow/ecologyFlow.jsp'
    } //水资源保护--业务工作-生态流量管控
    else if (id == 'dxsccqzhzl') {
      url += 'pages/szybh/ywgz/groundWater/groundWater.jsp'
    } //水资源保护--业务工作-地下水超采区综合治理
    else if (id == 'yysszybh') {
      url += 'pages/szybh/ywgz/drinkProtect/drinkProtect.jsp'
    } //水资源保护--业务工作-饮用水水源保护
    else if (id == 'tfswryd') {
      url += 'pages/szybh/ywgz/suddenlyWaterPollution/suddenlyWaterPollution.jsp'
    } //水资源保护--业务工作-突发水污染应对
    else if (id == 'shjzl') {
      url += 'pages/szybh/ywgz/waterEnvQuality/waterEnvQuality.jsp'
    } //水资源保护--业务工作-水环境质量
    else if (id == 'szybhyb') {
      url += 'pages/szybh/ywgz/waterProtectMonthReport/waterProtectMonthReport.jsp'
    } //水资源保护--业务工作-水环境质量
    else if (id == 'dxstb') {
      url += 'pages/szybh/ywgz/dataFill/groundWater/GWFillList.jsp'
    } //水资源保护--数据填报-地下水通报
    else if (id == 'zysyd') {
      url += 'pages/szybh/ywgz/dataFill/groundWater/DP/DP.jsp'
    } //水资源保护--数据填报-重要水源地
    else if (id == 'dxssznb') {
      url += 'pages/szybh/ywgz/dataFill/waterEnvQuality/belowWaterYearFillList.jsp'
    } else if (id == 'stllkh') {
      url += 'pages/szybh/ywgz/dataFill/ecologyFlow/EFFillList.jsp'
    } else if (id == 'dbssz') {
      url += 'pages/szybh/ywgz/dataFill/groundWater/AboveFillList.jsp'
    } //水资源保护--数据填报-地表水水质
    else if (id == 'dxssznb') {
      url += 'pages/szybh/ywgz/dataFill/groundWater/BellowFillList.jsp'
    } //水资源保护--数据填报-地下水水质年报
    else if (id == 'dbsszyb') {
      url += 'pages/szybh/ywgz/dataFill/waterEnvQuality/aboveWaterMonFillList.jsp'
    } //水资源保护--数据填报-地表水水质月报
    else if (id == 'szybhglsy') {
      url += 'pages/szybh/ywgz/sy/sy.jsp'
    } //首页

    if (url != basePath) {
      $('#bodyIframe').attr('src', url) //
    }
  })

  //临时设置为节水管理
  $(".top_menu li[id='jyys_new']").click()

  //$(".top_menu li[id='kfly']").click();
})

//节水模块首页跳转 到新闻统计
function turnToXwtj() {
  $('#jssy')
    .find('img')
    .attr('src', basePath + 'images/index/jssy-01.png')
  $('#lygk')
    .find('img')
    .attr('src', basePath + 'images/index/lygk-02.png')
  $('#bodyIframe').attr('src', basePath + 'pages/jyys_new/lygk/xwtj/xwtj.jsp')
  $('#ywgz')
    .find('img')
    .attr('src', basePath + 'images/index/ztyj-02.png')
}
//节水模块首页跳转 到新闻统计
function turnToQysjksj() {
  $('#jssy')
    .find('img')
    .attr('src', basePath + 'images/index/jssy-01.png')
  $('#ywsj')
    .find('img')
    .attr('src', basePath + 'images/index/ywsj-02.png')
  $('#bodyIframe').attr('src', basePath + 'pages/jyys_new/ywsj/zdjkysdw/ysqk/tab.jsp')
}

function changeIframe(url) {
  $('#bodyIframe').attr('src', url)
}

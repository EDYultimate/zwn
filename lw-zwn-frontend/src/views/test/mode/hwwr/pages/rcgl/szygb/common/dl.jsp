<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String type = request.getParameter("type")==null?"":request.getParameter("type");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    <title>水质指标</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <style>
        .s_input{
            height:25px;
            width:70px;
            padding: 0px 10px 0 10px;
            border-radius: 15px;
            border: 1px solid #E1E1E1;
            background-color: rgba(2, 194, 153, 1);
            outline:none;
            color:#FFFFFF;
        }
        .ttitle {
        }
        .ttitle>td {
            font-weight: 600;
        }
        .trow {
            font-size: 14px;
        }
    </style>
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript">
        var type = "<%=type%>";
        if (!type) {
            type = "l1"; // 默认
        }


    </script>
</head>

<body>
<div>
    <table id="l1table" style="display: none;">
        <tr>
            <td class="trow"><input type="checkbox" id="C000000110000" />北京</td>
            <td class="trow"><input type="checkbox" id="C000000120000" />天津</td>
            <td class="trow"><input type="checkbox" id="C000000130000" />河北</td>
            <td class="trow"><input type="checkbox" id="C000000140000" />山西</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000410000" />河南</td>
            <td class="trow"><input type="checkbox" id="C000000370000" />山东</td>
            <td class="trow"><input type="checkbox" id="C000000150000" />内蒙</td>
            <td class="trow"><input type="checkbox" id="C000000210000" />辽宁</td>
        </tr>
    </table>

    <table id="l2table" style="display: none;">
        <tr>
            <td class="trow"><input type="checkbox" id="C010000040000" />滦河及冀东沿海</td>
            <td class="trow"><input type="checkbox" id="C020000040000" />海河北系</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030000040000" />海河南系</td>
            <td class="trow"><input type="checkbox" id="C040000040000" />徒骇马颊河</td>
        </tr>
    </table>

    <table id="l3table" style="width:900px;height:527px;display: none;">
        <tr class="ttitle">
            <td>北京市</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C020100110000" />北三河山区(蓟、潮、北）</td>
            <td class="trow"><input type="checkbox" id="C020300110000" />永定河册田水库至三家店区间</td>
            <td class="trow"><input type="checkbox" id="C020400110000" />北四河下游平原</td>
            <td class="trow"><input type="checkbox" id="C030100110000" />大清河山区</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030200110000" />大清河淀西平原</td>
        </tr>
        <tr class="ttitle">
            <td>天津市</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C020100120000" />北三河山区(蓟、潮、北）</td>
            <td class="trow"><input type="checkbox" id="C020400120000" />北四河下游平原</td>
            <td class="trow"><input type="checkbox" id="C030300120000" />大清河淀东平原</td>
        </tr>
        <tr class="ttitle">
            <td>河北省</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C010100130000" />滦河山区</td>
            <td class="trow"><input type="checkbox" id="C010200130000" />滦河平原及冀东沿海诸河</td>
            <td class="trow"><input type="checkbox" id="C020100130000" />北三河山区(蓟、潮、北）</td>
            <td class="trow"><input type="checkbox" id="C020300130000" />永定河册田水库至三家店区间</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C020400130000" />北四河下游平原</td>
            <td class="trow"><input type="checkbox" id="C030100130000" />大清河山区</td>
            <td class="trow"><input type="checkbox" id="C030200130000" />大清河淀西平原</td>
            <td class="trow"><input type="checkbox" id="C030300130000" />大清河淀东平原</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030400130000" />子牙河山区</td>
            <td class="trow"><input type="checkbox" id="C030500130000" />子牙河平原</td>
            <td class="trow"><input type="checkbox" id="C030600130000" />漳卫河山区</td>
            <td class="trow"><input type="checkbox" id="C030700130000" />漳卫河平原</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030800130000" />黑龙港及运东平原</td>
            <td class="trow"><input type="checkbox" id="C040100130000" />徒骇马颊河</td>
        </tr>
        <tr class="ttitle">
            <td>山西省</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C020200140000" />永定河册田水库以上</td>
            <td class="trow"><input type="checkbox" id="C020300140000" />永定河册田水库至三家店区间</td>
            <td class="trow"><input type="checkbox" id="C030100140000" />大清河山区</td>
            <td class="trow"><input type="checkbox" id="C030400140000" />子牙河山区</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030600140000" />漳卫河山区</td>
        </tr>
        <tr class="ttitle">
            <td>河南省</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030600410000" />漳卫河山区</td>
            <td class="trow"><input type="checkbox" id="C030700410000" />漳卫河平原</td>
            <td class="trow"><input type="checkbox" id="C040100410000" />徒骇马颊河</td>
        </tr>
        <tr class="ttitle">
            <td>山东省</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C040100370000" />徒骇马颊河</td>
        </tr>
        <tr class="ttitle">
            <td>内蒙古自治区</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C010100150000" />滦河山区</td>
            <td class="trow"><input type="checkbox" id="C020200150000" />永定河册田水库以上</td>
            <td class="trow"><input type="checkbox" id="C020300150000" />永定河册田水库至三家店区间</td>
        </tr>
        <tr class="ttitle">
            <td>辽宁省</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C010100210000" />滦河山区</td>
        </tr>
    </table>

    <table id="l4table" style="width: 670px;height: 242px;display: none;">
        <tr class="ttitle">
            <td>滦河及冀东沿海</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C010100040000" />滦河山区</td>
            <td class="trow"><input type="checkbox" id="C010200040000" />滦河平原及冀东沿海诸河</td>
        </tr>
        <tr class="ttitle">
            <td>海河北系</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C020100040000" />北三河山区</td>
            <td class="trow"><input type="checkbox" id="C020200040000" />永定河册田水库以上</td>
            <td class="trow"><input type="checkbox" id="C020300040000" />永定河册田水库至三家店区间</td>
            <td class="trow"><input type="checkbox" id="C020400040000" />北四河下游平原</td>
        </tr>
        <tr class="ttitle">
            <td>海河南系</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030100040000" />大清河山区</td>
            <td class="trow"><input type="checkbox" id="C030200040000" />大清河淀西平原</td>
            <td class="trow"><input type="checkbox" id="C030300040000" />大清河淀东平原</td>
            <td class="trow"><input type="checkbox" id="C030400040000" />子牙河山区</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C030500040000" />子牙河平原</td>
            <td class="trow"><input type="checkbox" id="C030600040000" />漳卫河山区</td>
            <td class="trow"><input type="checkbox" id="C030700040000" />漳卫河平原</td>
            <td class="trow"><input type="checkbox" id="C030800040000" />黑龙港及运东平原</td>
        </tr>
        <tr class="ttitle">
            <td>徒骇马颊河</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C040100040000" />徒骇马颊河</td>
        </tr>
    </table>

    <table id="l6table" style="width: 670px;height: 338px;display: none;">
        <tr>
            <td class="trow"><input type="checkbox" id="C000000130000" />北京</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000120000" />天津</td>
        </tr>
        <tr class="ttitle">
            <td>河北</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000130200" />唐山</td>
            <td class="trow"><input type="checkbox" id="C000000130300" />秦皇岛</td>
            <td class="trow"><input type="checkbox" id="C000000130700" />张家口</td>
            <td class="trow"><input type="checkbox" id="C000000130800" />承德</td>
            <td class="trow"><input type="checkbox" id="C000000131000" />廊坊</td>
            <td class="trow"><input type="checkbox" id="C000000130600" />保定</td>
            <td class="trow"><input type="checkbox" id="C000000130100" />石家庄</td>
            <td class="trow"><input type="checkbox" id="C000000130900" />沧州</td>
            <td class="trow"><input type="checkbox" id="C000000131100" />衡水</td>
            <td class="trow"><input type="checkbox" id="C000000130400" />邯郸</td>
            <td class="trow"><input type="checkbox" id="C000000130500" />邢台</td>
        </tr>
        <tr class="ttitle">
            <td>山西</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000140200" />大同</td>
            <td class="trow"><input type="checkbox" id="C000000140600" />朔州</td>
            <td class="trow"><input type="checkbox" id="C000000140900" />忻州</td>
            <td class="trow"><input type="checkbox" id="C000000140100" />太原</td>
            <td class="trow"><input type="checkbox" id="C000000140300" />阳泉</td>
            <td class="trow"><input type="checkbox" id="C000000140700" />晋中</td>
            <td class="trow"><input type="checkbox" id="C000000140400" />长治</td>
            <td class="trow"><input type="checkbox" id="C000000140500" />晋城</td>
        </tr>
        <tr class="ttitle">
            <td>河南</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000410500" />安阳</td>
            <td class="trow"><input type="checkbox" id="C000000410600" />鹤壁</td>
            <td class="trow"><input type="checkbox" id="C000000410700" />新乡</td>
            <td class="trow"><input type="checkbox" id="C000000410800" />焦作</td>
            <td class="trow"><input type="checkbox" id="C000000410900" />濮阳</td>
        </tr>
        <tr class="ttitle">
            <td>山东</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000370100" />济南</td>
            <td class="trow"><input type="checkbox" id="C000000370500" />东营</td>
            <td class="trow"><input type="checkbox" id="C000000371400" />德州</td>
            <td class="trow"><input type="checkbox" id="C000000371500" />聊城</td>
            <td class="trow"><input type="checkbox" id="C000000371600" />滨州</td>
        </tr>
        <tr class="ttitle">
            <td>内蒙古</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000152500" />锡盟</td>
            <td class="trow"><input type="checkbox" id="C000000150900" />乌盟</td>
        </tr>
        <tr class="ttitle">
            <td>辽宁</td>
        </tr>
        <tr>
            <td class="trow"><input type="checkbox" id="C000000211300" />朝阳</td>
            <td class="trow"><input type="checkbox" id="C000000211400" />葫芦岛</td>
        </tr>
    </table>
    <div style="width:200px;float:right;padding: 10px;">
        <input id="checkBtn" type="button" value="取消全选" class="s_input" onclick="checkToggle()">
        <input id="confirmBtn" type="button" value="确定" class="s_input" onclick="confirmBtn()">
        <input type="hidden" id="checkFlg" value="0">
    </div>
</div>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/szygb/common/dl.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/szygb/common/types.js"></script>
</html>

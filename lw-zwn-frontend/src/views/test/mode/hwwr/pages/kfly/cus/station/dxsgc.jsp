<%--
  Created by IntelliJ IDEA.
  User: lonwin-alex
  Date: 2019/1/7
  Time: 16:24
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" import="java.util.*" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>地下水工程信息</title>
    <link rel="stylesheet" href="<%=basePath%>common/js/element/index.css">
    <script type="text/javascript" src="<%=basePath %>common/js/vue.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/element/index.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/axios.min.js"></script>
    <script>var basePath = '<%=basePath%>'</script>
    <style>
        body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,dl,dd,form,fieldset,legend,input,textarea,select{margin:0;padding:0}
        .filter {
            padding: 8px;
            background-color: rgba(225, 232, 240, 1);
            font-size: 15px;
            position: fixed;
            z-index: 1;
            width: 100%;
            top: 0;
        }
        .table-title {
            text-align: center;
            background-color: #ffffff;
            padding: 15px 0;
            font-weight: bold;
            margin-top: 60px;
        }
        .f-item {
            padding-left: 10px;
        }
        .page{position:relative;-ms-flex-direction:column;flex-direction:column;min-height:100vh}
        .page-loading{background:center no-repeat;background-size:auto}
        .js-hidden{display:none!important}
        .el-form-item {
            border: 1px #ebeef5 solid;
            width: 60%;
            margin: 0 auto;
        }
        .el-form-item__content {
            border-left: 1px #ebeef5 solid;
        }
        .dialog-filter {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
<div id="page-loading" class="page page-loading" style="background-image:url(<%=basePath%>common/js/layer/theme/default/loading-0.gif)"></div>
<div id="app" class="page js-hidden">
    <div class="filter">
        工程类型：
        <el-select v-model="value"
                   style="margin-right: 20px;width: 120px;"
                   placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
        <el-radio-group v-model="radio" @change="filterChange">
            <el-radio label="1">
                行政分区：
                <el-select v-model="value7"
                           :disabled="disXz"
                           multiple
                           collapse-tags
                           placeholder="请选择"
                           style="margin-right: 20px;"
                           @change="selectAll">
                    <el-option-group
                            v-for="group in options3"
                            :key="group.label"
                            :label="group.label">
                        <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-radio>
            <el-radio label="2">
                水资源分区：
                <el-select
                        v-model="value11"
                        :disabled="disSzy"
                        multiple
                        collapse-tags
                        style="margin-right: 20px;width: 260px;"
                        placeholder="请选择"
                        @change="selectAll4Water">
                    <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-radio>
        </el-radio-group>
        <el-button type="warning" icon="el-icon-search" @click="searchStations">搜索</el-button>
    </div>
    <div class="table-title">地下水工程信息查询</div>
    <el-table border
              v-loading="loading"
            :data="stationData"
            :row-style="rowClass"
            :cell-style="cellClass"
            style="width: 100%"
            @row-click="gcDetail">
        <el-table-column
                align="center"
                label="测站编号">
            <template slot-scope="scope">
                <span>{{ scope.row.STCD }}</span>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="STNM"
                label="测站名称">
        </el-table-column>
        <el-table-column
                align="center"
                prop="LGTD"
                label="经度">
        </el-table-column>
        <el-table-column
                align="center"
                prop="LTTD"
                label="纬度">
        </el-table-column>
    </el-table>
    <el-dialog top="12" width="1000" :title="dialogTitle" :visible.sync="dialogDetailVisible" @close="dialogClose">
        <el-tabs v-model="activeName2" type="card" @tab-click="tabClick">
            <el-tab-pane label="测站信息" name="first">
                <el-form label-position="right" label-width="45%" :model="formLabelAlign">
                    <el-form-item label="测站类型">
                        <span class="f-item">{{formLabelAlign.ROHS | typeFilter}}</span>
                    </el-form-item>
                    <el-form-item label="测站编码">
                        <span class="f-item">{{formLabelAlign.STCD}}</span>
                    </el-form-item>
                    <el-form-item label="测站名称">
                        <span class="f-item">{{formLabelAlign.STNM}}</span>
                    </el-form-item>
                    <el-form-item label="测站地点">
                        <span class="f-item">{{formLabelAlign.STLC}}</span>
                    </el-form-item>
                    <el-form-item label="经度坐标">
                        <span class="f-item">{{formLabelAlign.LGTD}}</span>
                    </el-form-item>
                    <el-form-item label="纬度坐标">
                        <span class="f-item">{{formLabelAlign.LTTD}}</span>
                    </el-form-item>
                    <el-form-item label="监测时间">
                        <span class="f-item">{{formLabelAlign.TM}}</span>
                    </el-form-item>
                    <el-form-item label="埋深">
                        <span class="f-item">{{formLabelAlign.BD}}</span>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="埋深信息" name="second">
                <div class="dialog-filter">
                    测站编码：{{rowCD}}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    时间范围：
                    <%--<el-date-picker--%>
                            <%--v-model="dateRange"--%>
                            <%--type="daterange"--%>
                            <%--range-separator="至"--%>
                            <%--start-placeholder="开始日期"--%>
                            <%--end-placeholder="结束日期">--%>
                    <%--</el-date-picker>--%>
                    <el-date-picker
                            v-model="startDate"
                            type="month"
                            :clearable="false"
                            placeholder="起始时间">
                    </el-date-picker>
                    <el-date-picker
                            v-model="endDate"
                            :picker-options="endDateOpt"
                            type="month"
                            :clearable="false"
                            placeholder="结束时间">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="searchStationValue">搜索</el-button>
                    <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出Excel</el-button>
                </div>
                <el-table border :data="detailData"
                          :row-style="rowClass"
                          :cell-style="cellClass"
                          style="width: 40%;float: left;" height=500>
                    <el-table-column property="MONTHLIST" label="时间"></el-table-column>
                    <el-table-column property="BD" label="埋深"></el-table-column>
                    <el-table-column property="Z" label="水位"></el-table-column>
                </el-table>
                <div id="main" style="width: 550px;height:400px;float: right;"></div>
            </el-tab-pane>
        </el-tabs>

    </el-dialog>
</div>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/gis/common/js/jquery-1.11.1.min.js"></script>
<script>
    window
        .addEventListener("load", function () {
            !function () {
                var e = document.getElementById("app");
                    document.getElementById("page-loading")
                        .classList
                        .add("js-hidden"),
                    e.classList.remove("js-hidden")
            }()
        });
    const app = new Vue({
        data() {
            return {
                radio: '1',
                disXz: false,
                disSzy: true,
                oldOptions: [],
                oldWaterOptions: [],
                options: [{
                    value: '1',
                    label: '国家测站'
                }, {
                    value: '2',
                    label: '省级测站'
                }],
                value: '1',
                options3: [{
                    options: [{
                        value: '000000',
                        label: '全选'
                    }]
                }, {
                    label: '北京市',
                    options: [{
                        value: '110100',
                        label: '北京市'
                    }]
                }, {
                    label: '天津市',
                    options: [{
                        value: '120100',
                        label: '天津市'
                    }]
                }, {
                    label: '河北省',
                    options: [{
                        value: '130100',
                        label: '石家庄市'
                    },{
                        value: '130200',
                        label: '唐山市'
                    },{
                        value: '130300',
                        label: '秦皇岛市'
                    },{
                        value: '130400',
                        label: '邯郸市'
                    },{
                        value: '130500',
                        label: '邢台市'
                    },{
                        value: '130600',
                        label: '保定市'
                    },{
                        value: '130900',
                        label: '沧州市'
                    },{
                        value: '131000',
                        label: '廊坊市'
                    },{
                        value: '131100',
                        label: '衡水市'
                    }]
                }, {
                    label: '河南省',
                    options: [{
                        value: '410500',
                        label: '安阳市'
                    },{
                        value: '410600',
                        label: '鹤壁市'
                    },{
                        value: '410700',
                        label: '新乡市'
                    },{
                        value: '410800',
                        label: '焦作市'
                    },{
                        value: '410900',
                        label: '濮阳市'
                    }]
                }, {
                    label: '山东省',
                    options: [{
                        value: '370100',
                        label: '济南市'
                    },{
                        value: '370500',
                        label: '东营市'
                    },{
                        value: '371400',
                        label: '德州市'
                    },{
                        value: '371500',
                        label: '聊城市'
                    },{
                        value: '371600',
                        label: '滨州市'
                    }]
                }],
                value7: [],
                options2: [{
                    value: "'000000'",
                    label: '全选'
                }, {
                    value: "'C010200'",
                    label: '滦河平原及冀东沿海诸河'
                }, {
                    value: "'C020400'",
                    label: '北四河下游平原'
                }, {
                    value: "'C030200'",
                    label: '大清河淀西平原'
                }, {
                    value: "'C030300'",
                    label: '大清河淀东平原'
                }, {
                    value: "'C030500'",
                    label: '子牙河平原'
                }, {
                    value: "'C030700'",
                    label: '漳卫河平原'
                }, {
                    value: "'C030800'",
                    label: '黑龙港及运东平原'
                }, {
                    value: "'C040100'",
                    label: '徒骇马颊河'
                }],
                value11: [],
                stationData: [],
                dialogDetailVisible: false,
                detailData: [],
                activeName2: 'first',
                formLabelAlign: {
                    ROHS: '',
                    STCD: '',
                    STNM: '',
                    STLC: '',
                    LGTD: '',
                    LTTD: '',
                    TM: '',
                    BD: ''
                },
                loading: false,
                rowCD: '',
                dialogTitle: '',
                startDate: new Date('2017-01-01'),
                endDate: new Date(),
                endDateOpt: {
                    disabledDate: (time) => {
                        return (time.getTime() < this.startDate || time.getTime() > Date.now())
                    }
                }
            }
        },
        filters: {
            typeFilter(type) {
                const typeMap = {
                    '1': '国家测站',
                    '2': '省级测站',
                    '3': '省级测站'
                }
                return typeMap[type]
            }
        },
        methods: {
            filterChange() {
                console.log(this.radio)
                if (this.radio === '1') {
                    this.disXz = false
                    this.disSzy = true
                    this.value11 = ["'C010200'"]
                } else {
                    this.disXz = true
                    this.disSzy = false
                    this.value7 = ['120100']
                }
            },
            selectAll(val) {
                let allValues = []
                //保留所有值
                for (let item of this.options3) {
                    for (let item1 of item.options) {
                        allValues.push(item1.value)
                    }
                }

                // 用来储存上一次的值，可以进行对比
                const oldVal = this.oldOptions.length === 0 ? [] : this.oldOptions[1]

                // 若是全部选择
                if (val.includes('000000')) this.value7 = allValues

                // 取消全部选中  上次有 当前没有 表示取消全选
                if (oldVal.includes('000000') && !val.includes('000000')) this.value7 = []

                // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
                // 新老数据都有全部选中
                if (oldVal.includes('000000') && val.includes('000000')) {
                    const index = val.indexOf('000000')
                    val.splice(index, 1) // 排除全选选项
                    this.value7 = val
                }

                //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
                if (!oldVal.includes('000000') && !val.includes('000000')) {
                    if (val.length === allValues.length - 1) this.value7 = ['000000'].concat(val)
                }

                //储存当前最后的结果 作为下次的老数据
                this.oldOptions[1] = this.value7
            },
            selectAll4Water(val) {
                let allValues = []
                //保留所有值
                for (let item of this.options2) {
                    allValues.push(item.value)
                }

                // 用来储存上一次的值，可以进行对比
                const oldVal = this.oldWaterOptions.length === 0 ? [] : this.oldWaterOptions[1]

                // 若是全部选择
                if (val.includes('000000')) this.value11 = allValues

                // 取消全部选中  上次有 当前没有 表示取消全选
                if (oldVal.includes('000000') && !val.includes('000000')) this.value11 = []

                // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
                // 新老数据都有全部选中
                if (oldVal.includes('000000') && val.includes('000000')) {
                    const index = val.indexOf('000000')
                    val.splice(index, 1) // 排除全选选项
                    this.value11 = val
                }

                //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
                if (!oldVal.includes('000000') && !val.includes('000000')) {
                    if (val.length === allValues.length - 1) this.value11 = ['000000'].concat(val)
                }

                //储存当前最后的结果 作为下次的老数据
                this.oldWaterOptions[1] = this.value11
            },
            searchStations() {
                this.loading = true
                let _this = this
                axios({
                    method: 'get',
                    url: '/hwwr/cusstation/inquireAllStations',
                    params: {
                        stationType: this.value,
                        xzSzyVal: this.radio === '1' ? this.value7.toString() : this.value11.toString(),
                        xzSzyFlag: this.radio === '1' ? 'xzfq' : 'szyfq' // xzfq szyfq
                    },
                    transformRequest: [function (data) {
                        var ret = ''
                        for (var it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret;
                    }]
                }).then(function (response) {
                    _this.stationData = response.data
                    _this.loading = false
                }).catch(function (error) {
                    console.error(error)
                })
            },
            rowClass: function (row, index) {
                return { "height": 0, 'cursor': 'pointer' }
            },
            cellClass: function (row, index) {
                return { "padding": '5px 0' }
            },
            gcDetail(row, event, column) {
                this.rowCD = row.STCD
                this.dialogTitle = row.STNM
                this.dialogDetailVisible = true
                this.formLabelAlign.ROHS = ''
                this.formLabelAlign.STCD = ''
                this.formLabelAlign.STNM = ''
                this.formLabelAlign.STLC = ''
                this.formLabelAlign.LGTD = ''
                this.formLabelAlign.LTTD = ''
                this.formLabelAlign.TM = ''
                this.formLabelAlign.BD = ''
                let _this = this
                axios({
                    method: 'get',
                    url: '/hwwr/cusstation/loadGcxxInfo',
                    params: {
                        rohs: row.ROHS,
                        stcd: row.STCD,
                    }
                }).then(function (response) {
                    _this.formLabelAlign.ROHS = response.data[0].ROHS
                    _this.formLabelAlign.STCD = response.data[0].STCD
                    _this.formLabelAlign.STNM = response.data[0].STNM
                    _this.formLabelAlign.STLC = response.data[0].STLC
                    _this.formLabelAlign.LGTD = response.data[0].LGTD
                    _this.formLabelAlign.LTTD = response.data[0].LTTD
                    _this.formLabelAlign.TM = response.data[0].TM
                    _this.formLabelAlign.BD = response.data[0].BD
                    console.log(_this.formLabelAlign)
                }).catch(function (error) {
                    console.error(error)
                })
            },
            tabClick(tab, event) {
                if (tab.name === 'second') {
                    this.searchStationValue()
                }
            },
            dialogClose() {
                this.activeName2 = 'first'
                this.startDate = new Date('2017-01-01')
                this.endDate = new Date()
            },
            searchStationValue() {
                let litYm = typeof(this.startDate) === "object"
                    ? this.startDate.getFullYear() + '/'
                        + ((this.startDate.getMonth()+1).toString().length===1 ? '0'+(this.startDate.getMonth()+1) : (this.startDate.getMonth()+1))
                    : this.startDate
                let bigYm = typeof(this.endDate) === "object"
                    ? this.endDate.getFullYear() + '/'
                        + ((this.endDate.getMonth()+1).toString().length===1 ? '0'+(this.endDate.getMonth()+1) : (this.endDate.getMonth()+1))
                    : this.endDate
                let _this = this
                axios({
                    methods: 'get',
                    url: '/hwwr/cusstation/inquireStationValue',
                    params: {
                        stcd: this.rowCD,
                        litYm: litYm,
                        bigYm: bigYm
                    }
                }).then(function (response) {
                    _this.detailData = response.data
                    _this.genEcharts(litYm, bigYm)
                }).catch(function (error) {
                    console.error(error)
                })
            },
            genEcharts(litYm, bigYm) {
                var titleStr = litYm + " - " + bigYm + "埋深分析图";
                var ymList = [];
                var list = [];
                while(litYm<=bigYm){
                    ymList.push(litYm);
                    if(parseInt(litYm.substr(5,2))<12){
                        if(parseInt(litYm.substr(5,2))+1<10){
                            litYm = litYm.substr(0,5)+"0"+(parseInt(litYm.substr(5,2))+1);
                        }else{
                            litYm = litYm.substr(0,5)+(parseInt(litYm.substr(5,2))+1);
                        }
                    }else{
                        litYm = (parseInt(litYm.substr(0,4))+1)+"/01";
                    }
                }
                for(var i=0;i<ymList.length;i++){
                    for(var j=0;j<this.detailData.length;j++){
                        if(ymList[i] === this.detailData[j].MONTHLIST){
                            list[i] = this.detailData[j].BD;
                            break;
                        }else{
                            list[i] = "";
                        }
                    }
                }
                var seriesData = [];
                seriesData.push({name: '埋深',type:'line',data:list});
                var myChart = echarts.init(document.getElementById("main"),"macarons");
                option = {
                    noDataLoadingOption: {
                        text: '暂无数据',
                        effect: 'bubble',
                        effectOption: {
                            effect: {
                                n: 0
                            }
                        }
                    },
                    title: {
                        text:  titleStr,//qsfxTime + fqNames + "埋深趋势分析图"
                        x: 'center'
                    },
                    tooltip : {
                        trigger: 'axis',

                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            // saveAsImage : {show: true}
                        }
                    },
                    grid: {
                        // left: '3%',
                        // right: '4%',
                        // bottom: '15%',
                        containLabel: true
                    },
                    legend: {
                        data: ["","","","埋深"],
                    },
                    dataZoom : {
                        show : true,
                        realtime: true,
                        start :0,
                        end : 25
                    },
                    xAxis : [
                        {
                            axisLine: {onZero: true},
                            data:ymList
                        }
                    ],
                    yAxis : [
                        {
                            inverse : true,
                            type : 'value',
                            name :  "(m)",
                            nameLocation : "start",
                        }
                    ],
                    series : seriesData
                };
                myChart.setOption(option);
            },
            exportExcel() {
                let litYm = typeof(this.startDate) === "object"
                    ? this.startDate.getFullYear() + '/'
                    + ((this.startDate.getMonth()+1).toString().length===1 ? '0'+(this.startDate.getMonth()+1) : (this.startDate.getMonth()+1))
                    : this.startDate
                let bigYm = typeof(this.endDate) === "object"
                    ? this.endDate.getFullYear() + '/'
                    + ((this.endDate.getMonth()+1).toString().length===1 ? '0'+(this.endDate.getMonth()+1) : (this.endDate.getMonth()+1))
                    : this.endDate
                let _this = this
                var url = basePath + "cusstation/exportExcel"
                var xhr = new XMLHttpRequest()
                xhr.open('POST', url, true);    // 也可以使用GET/POST方式，根据接口
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;")
                xhr.responseType = "blob" // 返回类型blob
                xhr.send("stcd="+this.rowCD+"&litYm="+litYm+"&bigYm="+bigYm)
                // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                xhr.onload = function () {
                    // 请求完成
                    if (this.status === 200) {
                        // 返回200
                        var blob = this.response;
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a标签href
                        reader.onload = function (e) {
                            // 转换完成，创建一个a标签用于下载
                            var a = document.createElement('a');
                            a.download = _this.rowCD+'埋深信息.xlsx'
                            a.href = e.target.result;
                            $("body").append(a);  // 修复firefox中无法触发click
                            a.click();
                            $(a).remove();
                        }
                    }
                }
            }
        },
        created: function() {
            this.value7 = ['120100']
            this.value11 = ["'C010200'"]
        },
        mounted() {
            this.searchStations()
        }
    }).$mount('#app')
</script>
</body>
</html>

<%--
  Created by IntelliJ IDEA.
  User: lonwin
  Date: 2020/9/23
  Time: 13:45
  To change this template use File | Settings | File Templates.
--%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath%>common/js/element/index.css">
    <script type="text/javascript" src="<%=basePath %>common/js/vue.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/element/index.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        .el-tag {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
            margin-bottom: 10px;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
            margin-bottom: 10px;
        }
    </style>
    <title>Title</title>
</head>
<body>
<div id="kws">
    <div v-loading="loading" style="min-height: 20px;">
        <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
            {{tag}}
        </el-tag>
    </div>
    <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新词</el-button>
    <div style="text-align: right; margin-right: 20px;">
        <el-button type="primary" @click="saveKW">保 存</el-button>
    </div>
</div>

<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript">

    var kws = new Vue({
        el: '#kws',
        data: {
            loading: true,
            dynamicTags: [],
            inputVisible: false,
            inputValue: ''
        },
        methods: {
            handleClose: function(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput: function() {
                this.inputVisible = true;
                var _this = this;
                this.$nextTick(function () {
                    _this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm: function() {
                var inputValue = this.inputValue;
                if (this.dynamicTags.indexOf(inputValue) > -1) {
                    return
                }
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            saveKW: function () {
                console.log(this.dynamicTags);
                var param = {};
                param.keyWord = this.dynamicTags.toString();
                $.ajax({
                    url: basePath+"jyys/jsxw/saveKW",
                    data: param,
                    dataType : "json",
                    type: 'post',
                    success: function(data) {
                        alert(data.info);
                        parent.layer.closeAll();
                    }
                });
            },
            getKW: function () {
                var _this = this;
                $.ajax({
                    url: basePath + 'jyys/jsxw/getKW',
                    dataType: 'json',
                    type: 'get',
                    success: function (data) {
                        _this.dynamicTags = data['KEY_WORD'].split(',');
                        _this.loading = false
                    }
                })
            }
        },
        mounted: function () {
            this.getKW();
        }
    });

</script>
</body>
</html>

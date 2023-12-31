<!DOCTYPE html>
<html>

<head>
    <title>{{ .title }}--房间Id({{ .appId }})</title>
    <style type="text/css">

    /*公共样式*/
    body,
    h1,
    h2,
    h3,
    h4,
    p,
    ul,
    ol,
    li,
    form,
    button,
    input,
    textarea,
    th,
    td {
        margin: 0;
        padding: 0
    }

    body,
    button,
    input,
    select,
    textarea {
        font: 12px/1.5 Microsoft YaHei UI Light, tahoma, arial, "\5b8b\4f53";
        *line-height: 1.5;
        -ms-overflow-style: scrollbar
    }

    h1,
    h2,
    h3,
    h4 {
        font-size: 100%
    }

    ul,
    ol {
        list-style: none
    }

    a {
        text-decoration: none
    }

    a:hover {
        text-decoration: underline
    }

    img {
        border: 0
    }

    button,
    input,
    select,
    textarea {
        font-size: 100%
    }

    table {
        border-collapse: collapse;
        border-spacing: 0
    }

    /*rem*/
    html {
        font-size: 62.5%;
    }

    body {
        font: 16px/1.5 "microsoft yahei", 'tahoma';
    }

    body .mobile-page {
        font-size: 1.6rem;
    }

    /*浮动*/
    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .clearfix:after {
        content: '';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    body {
        background-color: #F5F5F5;
    }

    .mobile-page {
        max-width: 600px;
    }

    .mobile-page .admin-img,
    .mobile-page .user-img {
        width: 45px;
        height: 45px;
    }

    i.triangle-admin,
    i.triangle-user {
        width: 0;
        height: 0;
        position: absolute;
        top: 10px;
        display: inline-block;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
    }

    .mobile-page i.triangle-admin {
        left: 4px;
        border-right: 12px solid #fff;
    }

    .mobile-page i.triangle-user {
        right: 4px;
        border-left: 12px solid #9EEA6A;
    }

    .mobile-page .admin-group,
    .mobile-page .user-group {
        padding: 6px;
        display: flex;
        display: -webkit-flex;
    }

    .mobile-page .admin-group {
        justify-content: flex-start;
        -webkit-justify-content: flex-start;
    }

    .mobile-page .user-group {
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
    }

    .mobile-page .admin-reply,
    .mobile-page .user-reply {
        display: inline-block;
        padding: 8px;
        border-radius: 4px;
        background-color: #fff;
        margin: 0 15px 12px;
    }

    .mobile-page .admin-reply {
        box-shadow: 0px 0px 2px #ddd;
    }

    .mobile-page .user-reply {
        text-align: left;
        background-color: #9EEA6A;
        box-shadow: 0px 0px 2px #bbb;
    }

    .mobile-page .user-msg,
    .mobile-page .admin-msg {
        width: 75%;
        position: relative;
    }

    .mobile-page .user-msg {
        text-align: right;
    }

    /*界面*/
    .interface {
        width: 1000px;
        height: 600px;
    }

    .personnel-list {
        float: left;
        width: 200px;
        height: 500px;
        background-color: #bbbbbb;
        border-style: solid;
        border-color: #000000;
        overflow: scroll;
    }

    /*聊天框*/
    .chat-with {
        float: left;
        width: 600px;
        height: 400px;
        background-color: #bbbbbb;
        border-style: solid;
        border-color: #000000;
        overflow: scroll;
    }

    .send-msg {
        float: left;
        width: 600px;
        height: 100px;
        background-color: #bbbbbb;
        border-style: solid;
        border-color: #000000;
        overflow: scroll;
    }

    /*room list*/
    .room-list{
        width: 600px;
        height: 200px;
        margin-left: 20px;
    }
    .room-list a{
        color: #428bca;
        text-decoration: none;
        padding-right: 20px;
    }
    </style>
</head>

<body>
    <div class="mobile-page">
        <div class="interface">
            <div class="personnel-list">
                <ul class="personnel-list-ul">
                </ul>
                <!-- 在线列表 -->
                <!-- 用户列表
            进入的时候拉取用户列表
            有人加入的时候添加
            有人退出以后删除 -->
            </div>

            <div class="chat-with">
                <div class="admin-group">
                    <div class="admin-img">
                        管理员
                    </div>
                    <div class="admin-msg">
                        <i class="triangle-admin"></i>
                        <span class="admin-reply">欢迎加入聊天~</span>
                    </div>
                </div>
            </div>

            <div class="send-msg">
                <!-- <input type="text" name="msg" placeholder="你想要发送的消息" value="" size="35">
                <button type="submit"> send</button> -->
                <form onsubmit="return doSubmit();">
                    <input type="text" name="msg" placeholder="你想要发送的消息" value="" size="35"/>
                    <input type="button" name="button" value="send" />
                </form>
            </div>
        </div>

        <div class="room-list">
            <div>
                <b>房间列表:</b><br>
               <a href="/home/index?appId=101">聊天室-Id:101</a>
               <a href="/home/index?appId=102">聊天室-Id:102</a>
               <a href="/home/index?appId=103">聊天室-Id:103</a>
               <a href="/home/index?appId=104">聊天室-Id:104</a>
           </div>
        </div>

        <!-- <script src="http://91vh.com/js/jquery-2.1.4.min.js"></script> -->
        <script src="../../static/js/v0/script.js"></script>
        <script type="text/javascript">
        appId = {{ .appId }};

        function currentTime() {
            let timeStamp = (new Date()).valueOf();

            return timeStamp
        }

        //////////////// 生成随机数 randomNumber


        ///////////////sendId

        function msg(name, msg) {
            let html = '<div class="admin-group">' +
                '<div class="admin-img" >' + name + '</div>' +
                // '<img class="admin-img" src="http://localhost/public/img/aa.jpg" />'+
                '<div class="admin-msg">' +
                '<i class="triangle-admin"></i>' +
                '<span class="admin-reply">' + msg + '</span>' +
                '</div>' +
                '</div>';
            return html
        }

        ////////////////////////把消息封装成html结构，展示到聊天区

        function userDiv(name) {

            let html = '<div id="' + name + '">' +
                name +
                '</div>';
            return html

        }

        ////////////////////addChatWith 聊天框中追加聊天内容，并且滚动条划到底部

        function addUserList(name) {
            music = "<li id=\"" + name + "\">" + name + "</li>";
            $(".personnel-list-ul").append(music);
        }

        function delUserList(name) {
            $("#" + name).remove();
        }


        ///////////////////////////ws onopen

        /////////////////////////////ws onMessage

        ////////////////////////////ws onclose

        /////////////////heartbeat

        /////////////////////////////////////////////发送消息按钮

        // 回车提交
        function doSubmit() {
            sendMsg();
            return false;
        }

        /////////////发送消息 sendMsg

        setTimeout(function() { getUserList(); }, 500); // 1秒后将会调用执行

        ////////////////获取在线用户列表 getUserList

        /////////////////getName
        </script>
    </div>
</body>

</html>
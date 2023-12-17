const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');
const msgSelected = document.querySelectorAll('.msg');

// 所有群组消息
const msgGroup = document.querySelectorAll('.group');

// 聊天区的在线用户列表
const chatAreaAvatarContainer = document.getElementById('chat-area-avatarContainer')

// WebSocket连接
let ws;
let member;
let appId = 101; // 你的应用程序ID

const avatarMap = {
  // 从 chrome 调试控制台推测的，貌似是以 HTML 文件为起点
  "小新2": "../../static/avatar/小新2.jpg",
  "小新3": "../../static/avatar/小新3.jpg",
  "上尾老师": "../../static/avatar/上尾老师.jpg",
  "动感超人": "../../static/avatar/动感超人.jpg",
  "小爱": "../../static/avatar/小爱.jpg",
  "春日部防卫队": "../../static/avatar/春日部防卫队.jpg",
  "暴走族": "../../static/avatar/暴走族.jpg",
  "松阪老师": "../../static/avatar/松阪老师.jpg",
  "沿川团": "../../static/avatar/沿川团.jpg",
  "胯下痛公寓": "../../static/avatar/胯下痛公寓.jpg",
  "野原一家": "../../static/avatar/野原一家.jpg"
};

/*****************************事件区*****************************************/
// 选择主题配色
colors.forEach(color => {
  color.addEventListener('click', e => {
    colors.forEach(c => c.classList.remove('selected'));
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

// 左侧消息对象选择脚本
msgSelected.forEach(msg => {
  msg.addEventListener('click', e => {
    msgSelected.forEach(m => m.classList.remove('active'));
    msg.classList.add('active');
  });
});

// 切换夜间模式
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// 上面添加事件的方法是js原生的，这里我们换个写法，使用jQuery来添加监听事件
$("#sendMsg").on("keypress", function(event) {
  // 检查是否按下的是回车键（键码为 13）
  if (event.key === "Enter") {
    sendMsg();
  }
  // 当然你也可以像上面一样，先依据 id 获取对应的元素，进而添加监听事件
});
/*********************************************************************/
// 聊天区域展示在线用户列表
function membersOnline() {
  // $ 是jQuery库的别名，用于访问jQuery提供的功能
  $.ajax({
    type: "GET",
    url: "http://" + homeData.httpUrl + "/user/list?appId=" + appId,
    dataType: "json",
    success: function(data) {
      console.log("user list:" + data.code + "userList:" + data.data.userList);
      if (data.code !== 200) {
        return false
      }
      // 最多展示的在线童鞋数量
      const maxMembers2Show = 5;

      // 计数器
      let createdMembers = 0;

      //i表示在data中的索引位置，n表示包含的信息的对象
      $.each(data.data.userList, function(i, n) {
        const existingMember = document.getElementById('memberOnline_' + n)
        if (!existingMember && createdMembers < maxMembers2Show){
          // 添加在线童鞋头像
          const memberOnline = document.createElement('img');
          memberOnline.classList.add('chat-area-profile')
          memberOnline.src = avatarMap[n]
          memberOnline.alt = n
          // 使用id标识唯一的童鞋 避免点击按钮无限新增已存在的 memberOnline 后期新加一个登录界面 n 设定为不能重复
          memberOnline.id = 'memberOnline_' + n
          chatAreaAvatarContainer.appendChild(memberOnline)
          // 更新计数器
          createdMembers ++
        }
      });
      if (data.data.userList.length > maxMembers2Show){
        const remainingMembers = data.data.userList.length - maxMembers2Show;
        const spanElement = document.createElement('span');
        spanElement.textContent = '+' + remainingMembers;
        chatAreaAvatarContainer.appendChild(spanElement);
      }
    }
  });
}

// 给所有群组消息添加一个 click 事件
msgGroup.forEach(group => {
  group.addEventListener('click', e => {
    // 请求服务器，获取当前群组内的全部在线用户
    membersOnline()
  });
});
/*****************************聊天区消息封装***********************************/
/* 这块儿的函数主要用于把name和msg封装成html结构，用来展示到聊天区*/

// 聊天内容
function buildMsgChat(name, msg) {
  // 根据 name 的值确定外层 div 的类名
  let msgBoxClass = (name === member) ? 'chat-msg owner' : 'chat-msg';
  return '<div class="' + msgBoxClass + '">' +
      // 童鞋信息 div 头像 + 消息时间
      '<div class="chat-msg-profile">' +
      '<img class="chat-msg-avatar" src="' + avatarMap[name] + '" alt="' + name + '">' +
      '<div class="chat-msg-date">' + currentTime() + '</div>' +
      '</div>' +
      // 聊天内容展示区
      '<div class="chat-msg-content">' +
      '<div class="chat-msg-text">' + msg + '</div>' +
      '</div>' +
      '</div>'
}

// 提示类消息 例如"xxx进入了聊天室"
function buildMsgNotice(name, msg) {
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
/****************************** websocket连接相关 *******************************************/
function getName(){
  // let names = ["小新","风间","妮妮","正南","阿呆","小白","美伢","广志","小绿","阿梅","园长","副园长","蜜琪","席林","大婶","卖豆腐der","阿豹","四郎","龙子","熊本的爷爷","九州的外公","阿银","玛丽","德朗","石阪","川口那小子","由美","书店老板","动感超人","钢达姆机器人","卖间九里代","玛丽莲","热藻椎造","小爱","小惠","小葵","小等","新子","上尾老师","黑矶","真伢","梦伢","风间麻麻","妮妮麻麻","正南麻麻","风间粑粑","妮妮粑粑","正南粑粑","小优","胆固醇麻醉","丽莎阿司匹林","厚子","厚美","厚司","中村","科长","部长","董事长","社长","史皮伯","魔法少女可爱P","叶月"];

  let names = ["小新2","小新3","上尾老师","动感超人","小爱","春日部防卫队","暴走族","松阪老师","沿川团","胯下痛公寓","野原一家"];

  return names[Math.floor(Math.random() * names.length)]
}

function currentTime() {
  return (new Date()).valueOf()
}

// 生成随机数
function randomNumber(minNum, maxNum) {
  // 根据传入参数的个数执行不同逻辑
  switch (arguments.length) {
    case 1:
      // radix 是进制
      return parseInt((Math.random() * minNum + 1).toString(), 10);
    case 2:
      return parseInt((Math.random() * (maxNum - minNum + 1) + minNum).toString(), 10);
    default:
      return 0;
  }
}

function sendId() {
  let timeStamp = currentTime();
  let randId = randomNumber(100000, 999999);

  return timeStamp + "-" + randId
}

// 心跳
function heartbeat() {
  console.log("定时心跳:" + member);

  ws.send('{"seq":"' + sendId() + '","cmd":"heartbeat","data":{}}');
}

// 初始化 websocket 连接
function initWebSocket() {
  // 创建 websocket 实例，连接到指定的 ws:url
  ws = new WebSocket("ws://"+homeData.webSocketUrl+"/acc");

  // ws 连接成功时的回调函数
  ws.onopen = function(evt) {
    console.log("Connection open ...");

    // 获取用户名
    member = getName();
    // 获取个人头像
    let avatarSrc = avatarMap[member]
    // 将头像填入HTML中的img标签
    const userProfileImg = document.querySelector(".user-profile");
    if (userProfileImg) {
      userProfileImg.src = avatarSrc;
    }
    console.log("用户准备登陆:" + member);

    // 发送登录命令
    ws.send('{"seq":"' + sendId() + '","cmd":"login","data":{"userId":"' + member + '","appId":'+ appId +'}}');

    // 定时心跳
    setInterval(heartbeat, 30 * 1000);
  };

  // 收到消息时的处理逻辑
  ws.onmessage = function(evt) {
    console.log("Received Message: " + evt.data);
    let data_array = JSON.parse(evt.data);
    console.log(data_array);

    let data;
    // 这里的 .cmd 是服务端定义在 msg_model 中的
    if (data_array.cmd === "msg") {
      data = data_array.response.data
      addChatWith(buildMsgChat(data.from, data.msg))}
    // } else if (data_array.cmd === "enter") {
    //   data = data_array.response.data
    //   addChatWith(msg("园长", "欢迎 " + data.from + " 加入~"))
    //   // addUserList(data.from)
    // } else if (data_array.cmd === "exit") {
    //   data = data_array.response.data
    //   addChatWith(msg("园长", data.from + " 悄悄的离开了~"))
    //   // delUserList(data.from)
    // }
  };
}

document.addEventListener("DOMContentLoaded", function() {
  // 页面加载完成之后，初始化 websocket 连接
  initWebSocket();
});
/*************************************************************/
// 聊天框追加聊天内容
function addChatWith(msg) {
  $(".chat-area-main").append(msg);
  // 页面滚动条置底
  $('.chat-area-main').animate({ scrollTop: document.body.clientHeight + 10000 + 'px' }, 80);
}

// 发送消息
function sendMsg() {
  // 使用 jQuery 选择器来获取页面上具有 name 属性值为 "msg2send" 的 <input> 元素的值，并将其存储在变量 msg 中。
  let msgContent = $("input[name='msg2send']").val()
  if (msgContent !== "") {
    $.ajax({
      type: "POST",
      url: 'http://'+homeData.httpUrl+'/user/sendMessageAll',
      data: {
        appId: appId,
        userId: member,
        msgId: sendId(),
        message: msgContent,
      },
      contentType: "application/x-www-form-urlencoded",
      success: function(data) {
        console.log(data);
        addChatWith(buildMsgChat(member, msgContent))
        // 输入框的内容置空
        $("input[name='msg2send']").val("");
      }
    });
  }
}
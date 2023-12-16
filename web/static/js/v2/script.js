const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');
const msgSelected = document.querySelectorAll('.msg');

// 所有群组消息
const msgGroup = document.querySelectorAll('.group');

// WebSocket连接
let ws;
let person;
let appId = 101; // 你的应用程序ID

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

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
/*********************************************************************/
// 给所有群组消息添加一个 click 事件
msgGroup.forEach(group => {
  group.addEventListener('click', e => {
    // 请求服务器，获取当前群组内的全部在线用户
  });
});

/****************************** websocket连接相关 *******************************************/
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

function getName(){
  // let names = ["小新","风间","妮妮","正南","阿呆","小白","美伢","广志","小绿","阿梅","园长","副园长","蜜琪","席林","大婶","卖豆腐der","阿豹","四郎","龙子","熊本的爷爷","九州的外公","阿银","玛丽","德朗","石阪","川口那小子","由美","书店老板","动感超人","钢达姆机器人","卖间九里代","玛丽莲","热藻椎造","小爱","小惠","小葵","小等","新子","上尾老师","黑矶","真伢","梦伢","风间麻麻","妮妮麻麻","正南麻麻","风间粑粑","妮妮粑粑","正南粑粑","小优","胆固醇麻醉","丽莎阿司匹林","厚子","厚美","厚司","中村","科长","部长","董事长","社长","史皮伯","魔法少女可爱P","叶月"];

  let names = ["小新2","小新3","上尾老师","动感超人","小爱","春日部防卫队","暴走族","松阪老师","沿川团","胯下痛公寓","野原一家"];

  return names[Math.floor(Math.random() * names.length)]
}

function currentTime() {
  return (new Date()).valueOf()
}

function sendId() {
  let timeStamp = currentTime();
  let randId = randomNumber(100000, 999999);

  return timeStamp + "-" + randId
}

// 心跳
function heartbeat() {
  console.log("定时心跳:" + person);

  ws.send('{"seq":"' + sendId() + '","cmd":"heartbeat","data":{}}');
}

function initWebSocket() {
  // 创建 websocket 实例，连接到指定的 ws:url
  ws = new WebSocket("ws://"+homeData.webSocketUrl+"/acc");

  // ws 连接成功时的回调函数
  ws.onopen = function(evt) {
    console.log("Connection open ...");

    // 获取用户名
    person = getName();
    // 获取个人头像
    let avatarSrc = avatarMap[person]
    // 将头像填入HTML中的img标签
    const userProfileImg = document.querySelector(".user-profile");
    if (userProfileImg) {
      userProfileImg.src = avatarSrc;
    }
    console.log("用户准备登陆:" + person);

    // 发送登录命令
    ws.send('{"seq":"' + sendId() + '","cmd":"login","data":{"userId":"' + person + '","appId":'+ appId +'}}');

    // 定时心跳
    setInterval(heartbeat, 30 * 1000);
  };

  // 收到消息时的处理逻辑
  ws.onmessage = function(evt) {
    console.log("Received Message: " + evt.data);
    let data_array = JSON.parse(evt.data);
    // data_array.cmd = undefined;
    console.log(data_array);

    let data;
    if (data_array.cmd === "msg") {
      data = data_array.response.data
      addChatWith(msg(data.from, data.msg))
    } else if (data_array.cmd === "enter") {
      data = data_array.response.data
      addChatWith(msg("园长", "欢迎 " + data.from + " 加入~"))
      addUserList(data.from)
    } else if (data_array.cmd === "exit") {
      data = data_array.response.data
      addChatWith(msg("园长", data.from + " 悄悄的离开了~"))
      delUserList(data.from)
    }
  };
}

document.addEventListener("DOMContentLoaded", function() {
  // 页面加载完成之后，初始化 websocket 连接
  initWebSocket();
});
/*************************************************************/
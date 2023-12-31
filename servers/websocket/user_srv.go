package websocket

import (
	"errors"
	"fmt"
	"time"

	"breeze/lib/cache"
	"breeze/models"
	"breeze/servers/grpcclient"

	"github.com/redis/go-redis/v9"
)

// UserList 查询所有用户
func UserList(appId uint32) (userList []string) {

	userList = make([]string, 0)
	currentTime := uint64(time.Now().Unix())
	servers, err := cache.GetServerAll(currentTime)
	if err != nil {
		fmt.Println("给全体用户发消息", err)
		return
	}

	for _, server := range servers {
		var (
			list []string
		)
		if IsLocal(server) {
			list = GetUserList(appId)
		} else {
			list, _ = grpcclient.GetUserList(server, appId)
		}
		userList = append(userList, list...)
	}

	return
}

// CheckUserOnline 查询用户是否在线
func CheckUserOnline(appId uint32, userId string) (online bool) {
	// 全平台查询
	if appId == 0 {
		for _, appId := range GetAppIds() {
			online, _ = checkUserOnline(appId, userId)
			if online == true {
				break
			}
		}
	} else {
		online, _ = checkUserOnline(appId, userId)
	}

	return
}

// checkUserOnline 查询用户 是否在线
func checkUserOnline(appId uint32, userId string) (online bool, err error) {
	key := GetUserKey(appId, userId)
	userOnline, err := cache.GetUserOnlineInfo(key)
	if err != nil {
		if err == redis.Nil {
			fmt.Println("GetUserOnlineInfo", appId, userId, err)

			return false, nil
		}

		fmt.Println("GetUserOnlineInfo", appId, userId, err)

		return
	}

	online = userOnline.IsOnline()

	return
}

// SendUserMessage 给用户发送消息
func SendUserMessage(appId uint32, userId string, msgId, message string) (sendResults bool, err error) {

	data := models.GetTextMsgData(userId, msgId, message)

	client := GetUserClient(appId, userId)

	if client != nil {
		// 在本机发送
		sendResults, err = SendUserMessageLocal(appId, userId, data)
		if err != nil {
			fmt.Println("给用户发送消息", appId, userId, err)
		}

		return
	}

	key := GetUserKey(appId, userId)
	info, err := cache.GetUserOnlineInfo(key)
	if err != nil {
		fmt.Println("给用户发送消息失败", key, err)

		return false, nil
	}
	if !info.IsOnline() {
		fmt.Println("用户不在线", key)
		return false, nil
	}
	server := models.NewServer(info.AccIp, info.AccPort)
	msg, err := grpcclient.SendMsg(server, msgId, appId, userId, models.MessageCmdMsg, models.MessageCmdMsg, message)
	if err != nil {
		fmt.Println("给用户发送消息失败", key, err)

		return false, err
	}
	fmt.Println("给用户发送消息成功-rpc", msg)
	sendResults = true

	return
}

// 给本机用户发送消息
func SendUserMessageLocal(appId uint32, userId string, data string) (sendResults bool, err error) {

	client := GetUserClient(appId, userId)
	if client == nil {
		err = errors.New("用户不在线")

		return
	}

	// 发送消息
	client.SendMsg([]byte(data))
	sendResults = true

	return
}

// SendUserMessageAll 通过 websocket 给所有在线童鞋发消息 server -> client
func SendUserMessageAll(appId uint32, userId string, msgId, cmd, message string) (sendResults bool, err error) {

	sendResults = true
	currentTime := uint64(time.Now().Unix())

	// 获取全部在线童鞋所在的服务器
	servers, err := cache.GetServerAll(currentTime)
	if err != nil {
		fmt.Println("{Send msg to all friend failed}|", err)
		return
	}

	for _, server := range servers {
		if IsLocal(server) { // 本地服务器
			data := models.GetMsgData(userId, msgId, cmd, message)
			AllSendMessages(appId, userId, data)
		} else { // 集群中的其他服务器
			grpcclient.SendMsgAll(server, msgId, appId, userId, cmd, message)
		}
	}

	return
}

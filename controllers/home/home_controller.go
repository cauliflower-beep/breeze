/**
* Created by GoLand.
* User: link1st
* Date: 2019-07-25
* Time: 12:11
 */

package home

import (
	"fmt"
	"net/http"
	"strconv"

	"breeze/servers/websocket"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

// Index 聊天页面 appId为房间号
func Index(c *gin.Context) {

	appIdStr := c.Query("appId")
	appIdUint64, _ := strconv.ParseInt(appIdStr, 10, 32)
	appId := uint32(appIdUint64)
	if !websocket.InAppIds(appId) {
		appId = websocket.GetDefaultAppId()
	}

	fmt.Println("http_request 聊天首页", appId)

	data := gin.H{
		"title":        "聊天首页",
		"appId":        appId,
		"httpUrl":      viper.GetString("app.httpUrl"),
		"webSocketUrl": viper.GetString("app.webSocketUrl"),
	}
	c.HTML(http.StatusOK, "index.tpl", data)
}

// IndexV2 聊天页面 appId为群号
func IndexV2(c *gin.Context) {

	appIdStr := c.Query("appId")
	appIdUint64, _ := strconv.ParseInt(appIdStr, 10, 32)
	appId := uint32(appIdUint64)
	if !websocket.InAppIds(appId) {
		// 请求房间号不包含在系统房间号中，进入默认房间号
		appId = websocket.GetDefaultAppId()
	}

	fmt.Println("http_request 聊天首页", appId)

	data := gin.H{
		"title":        "欢迎来到春日部~",
		"appId":        appId,
		"httpUrl":      viper.GetString("app.httpUrl"),
		"webSocketUrl": viper.GetString("app.webSocketUrl"),
	}
	c.HTML(http.StatusOK, "indexV2.html", data)
}

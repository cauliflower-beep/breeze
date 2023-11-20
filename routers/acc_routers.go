package routers

import (
	"breeze/servers/websocket"
)

// WebsocketInit Websocket 路由
func WebsocketInit() {
	websocket.Register("login", websocket.LoginController)
	websocket.Register("heartbeat", websocket.HeartbeatController)
	websocket.Register("ping", websocket.PingController)
}

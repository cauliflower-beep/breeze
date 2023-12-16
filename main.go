package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"time"

	"breeze/lib/redislib"
	"breeze/routers"
	"breeze/servers/grpcserver"
	"breeze/servers/task"
	"breeze/servers/websocket"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func main() {
	// 配置初始化
	initConfig()

	// 初始化日志文件
	initFile()

	// 初始化redis
	initRedis()

	router := gin.Default()
	// 初始化路由
	routers.Init(router)
	routers.WebsocketInit()

	// 定时任务
	task.Init()

	// 服务注册
	task.ServerInit()

	// 监听webSocket端口
	go websocket.StartWebSocket()

	// grpc
	go grpcserver.Init()

	go open()

	httpPort := viper.GetString("app.httpPort")
	_ = http.ListenAndServe(":"+httpPort, router)

}

// initFile 初始化日志
func initFile() {
	// Disable Console Color, you don't need console color when writing the logs to file.
	gin.DisableConsoleColor()

	// Logging to a file.
	logFile := viper.GetString("app.logFile")
	f, _ := os.Create(logFile)
	gin.DefaultWriter = io.MultiWriter(f) // 将日志同时写入到控制台以及上面创建的日志文件中
}

func initConfig() {
	viper.SetConfigName("config/app")
	viper.AddConfigPath(".") // 添加搜索路径

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}

	fmt.Println("config app:", viper.Get("app"))
	fmt.Println("config redis:", viper.Get("redis"))

}

func initRedis() {
	redislib.ExampleNewClient()
}

func open() {

	time.Sleep(1000 * time.Millisecond)

	httpUrl := viper.GetString("app.httpUrl")
	httpUrl = "http://" + httpUrl
	index0 := httpUrl + "/home/index"
	index2 := httpUrl + "/home/v2/index"

	fmt.Printf("访问页面体验\n home_old:%s\nhome_v2:%s\n", index0, index2)

	// 启动默认浏览器打开 home 主页
	cmd := exec.Command("open", httpUrl)
	_, _ = cmd.Output()
}

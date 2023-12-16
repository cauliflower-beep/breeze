package routers

import (
	"breeze/controllers/home"
	"breeze/controllers/systems"
	"breeze/controllers/user"
	"github.com/gin-gonic/gin"
)

func Init(router *gin.Engine) {

	/*
		配置静态资源路径
		/static 是在浏览器中访问静态资源时的 URL 前缀 例如 path:port/static/avatar/小新2.jpg 可以访问到对应图片资源
		web/static 似乎是从项目根目录开始的，跟当前代码文件所在的目录无关
	*/
	router.Static("/static", "web/static")
	/*
		LoadHTMLGlob用于加载HTML模板文件
		** 表示任意子目录；* 表示任意文件名
		所以这里加载的是 views 目录下所有子文件夹中的所有 HTML 文件
		如果不同子目录下有同名的 HTML 文件，后加载的文件会覆盖掉先前加载的文件
		views 只能包含一级子目录，如果嵌套的有子目录，可能会报错，需要编写额外的逻辑来处理
		views 子文件夹中只能包含 HTML 文件，其他文件需要放在另外的目录中
	*/
	router.LoadHTMLGlob("web/views/**/*")

	// 用户组
	userRouter := router.Group("/user")
	{
		userRouter.GET("/list", user.List)
		userRouter.GET("/online", user.Online)
		userRouter.POST("/sendMessage", user.SendMessage)
		userRouter.POST("/sendMessageAll", user.SendMessageAll)
	}

	// 系统
	systemRouter := router.Group("/system")
	{
		systemRouter.GET("/state", systems.Status)
	}

	// home
	homeRouter := router.Group("/home")
	{
		homeRouter.GET("/index", home.Index)
		// 添加新的 home 页面
		homeRouter.GET("/v2/index", home.IndexV2)
	}

	// router.POST("/user/online", user.Online)
}

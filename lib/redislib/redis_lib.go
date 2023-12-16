package redislib

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
)

var (
	client *redis.Client
)

func ExampleNewClient() {

	client = redis.NewClient(&redis.Options{
		Addr:         viper.GetString("redis.addr"),
		Password:     viper.GetString("redis.password"),
		DB:           viper.GetInt("redis.DB"),
		PoolSize:     viper.GetInt("redis.poolSize"),
		MinIdleConns: viper.GetInt("redis.minIdleConns"),
	})

	// 测试redis服务是否正常启动、能够ping通
	pong, err := client.Ping(context.Background()).Result()
	fmt.Println("初始化redis:", pong, err)
	// Output: PONG <nil>
}

// GetClient 获取一个redis链接句柄
func GetClient() (c *redis.Client) {

	return client
}

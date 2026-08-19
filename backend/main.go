package main

import (
	"fmt"
	"log"

	"backend/config"
)

func main() {
	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal("DB接続に失敗しました", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("DBインスタンスの取得に失敗しました", err)
	}

	fmt.Println("DB接続に成功しました")

	defer sqlDB.Close()
}

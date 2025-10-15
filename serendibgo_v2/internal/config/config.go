package config

import (
    "encoding/json"
    "os"
)

type Config struct {
    Port string `json:"port"`
    Env  string `json:"env"`
}

var AppConfig Config

func LoadConfig(filePath string) error {
    file, err := os.Open(filePath)
    if err != nil {
        return err
    }
    defer file.Close()

    decoder := json.NewDecoder(file)
    return decoder.Decode(&AppConfig)
}

func GetConfig() Config {
    return AppConfig
}
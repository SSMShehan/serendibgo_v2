package main

import (
    "log"
    "net/http"
    "serendibgo_v2/internal/config"
    "serendibgo_v2/internal/server"
)

func main() {
    // Load configuration
    cfg, err := config.LoadConfig()
    if err != nil {
        log.Fatalf("Error loading configuration: %v", err)
    }

    // Initialize the server
    srv := server.NewServer(cfg)

    // Start the server
    log.Printf("Starting server on %s", cfg.ServerAddress)
    if err := http.ListenAndServe(cfg.ServerAddress, srv.Router); err != nil {
        log.Fatalf("Error starting server: %v", err)
    }
}
package api

import (
    "net/http"
    "encoding/json"
)

// Response represents the structure of the API response
type Response struct {
    Message string `json:"message"`
}

// HelloHandler handles the /hello endpoint
func HelloHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    response := Response{Message: "Hello, World!"}
    json.NewEncoder(w).Encode(response)
}

// HealthCheckHandler handles the /health endpoint
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    response := Response{Message: "OK"}
    json.NewEncoder(w).Encode(response)
}
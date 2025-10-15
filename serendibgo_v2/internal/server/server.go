package server

import (
    "net/http"
    "log"
)

type Server struct {
    address string
}

func NewServer(address string) *Server {
    return &Server{address: address}
}

func (s *Server) Start() error {
    http.HandleFunc("/", s.handleRequest)
    log.Printf("Starting server on %s", s.address)
    return http.ListenAndServe(s.address, nil)
}

func (s *Server) handleRequest(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Hello, World!"))
}
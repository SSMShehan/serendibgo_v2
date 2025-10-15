# Makefile for the Serendibgo Project

.PHONY: all build clean run

all: build

build:
	go build -o serendibgo ./cmd/serendibgo/main.go

clean:
	go clean
	rm -f serendibgo

run: build
	./serendibgo
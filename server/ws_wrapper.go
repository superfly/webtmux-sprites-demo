package server

import (
	"io"
	"log"

	"github.com/gorilla/websocket"
)

type wsWrapper struct {
	*websocket.Conn
}

func (wsw *wsWrapper) Write(p []byte) (n int, err error) {
	writer, err := wsw.Conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return 0, err
	}
	defer writer.Close()
	return writer.Write(p)
}

func (wsw *wsWrapper) Read(p []byte) (n int, err error) {
	for {
		msgType, reader, err := wsw.Conn.NextReader()
		if err != nil {
			return 0, err
		}

		if msgType != websocket.TextMessage {
			continue
		}

		b, err := io.ReadAll(reader)
		if err != nil {
			return 0, err
		}
		if len(b) > len(p) {
			// Drop oversized messages instead of tearing down the tty. The
			// client is expected to chunk large pastes to stay under the
			// buffer size we advertised via SetBufferSize.
			log.Printf("webtty: dropping oversized client message (%d bytes, buffer=%d)", len(b), len(p))
			continue
		}
		n = copy(p, b)
		return n, nil
	}
}

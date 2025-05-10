class WebSocketService {
  constructor() {
    this.ws = null;
    this.callbacks = new Map();
  }

  connect() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.callbacks.has(data.type)) {
        this.callbacks.get(data.type)(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };
  }

  subscribe(type, callback) {
    this.callbacks.set(type, callback);
  }

  unsubscribe(type) {
    this.callbacks.delete(type);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new WebSocketService();

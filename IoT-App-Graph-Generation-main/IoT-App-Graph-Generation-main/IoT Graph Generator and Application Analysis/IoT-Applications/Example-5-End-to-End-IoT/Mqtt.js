const EventEmitter = require('events');

class MQTTBroker extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map(); // Stores connected clients and their options
    this.subscriptions = new Map(); // Maps topics to arrays of subscribed clients
    this.retainedMessages = new Map(); // Stores the last message for each topic
  }

  connect(clientId, options = {}) {
    this.clients.set(clientId, options);
    console.log(`[Broker] Client "${clientId}" connected.`);
    this.emit('connect', clientId, options);
  }

  publish(topic, message, options = {}) {
    console.log(`[Broker] Published to topic "${topic}": ${message}`);
    this.retainedMessages.set(topic, message); // Retain the last message for the topic

    // Notify all subscribers to the topic
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).forEach((clientId) => {
        this.emit('message', clientId, topic, message);
      });
    }
  }

  subscribe(clientId, topic) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    this.subscriptions.get(topic).push(clientId);
    console.log(`[Broker] Client "${clientId}" subscribed to "${topic}".`);
  }

  disconnect(clientId) {
    console.log(`[Broker] Client "${clientId}" disconnected.`);
    const clientOptions = this.clients.get(clientId);
    if (clientOptions && clientOptions.LWT) {
      // Deliver Last Will and Testament
      this.publish(clientOptions.LWT.topic, clientOptions.LWT.message);
    }
    this.clients.delete(clientId);
  }

  // New methods for inspecting the broker's state

  listClients() {
    console.log('[Broker] Connected clients:');
    for (const [clientId, options] of this.clients.entries()) {
      console.log(`- Client ID: ${clientId}, Options: ${JSON.stringify(options)}`);
    }
  }

  listSubscriptions() {
    console.log('[Broker] Subscriptions:');
    for (const [topic, clientIds] of this.subscriptions.entries()) {
      console.log(`- Topic: "${topic}", Subscribers: ${clientIds.join(', ')}`);
    }
  }

  listRetainedMessages() {
    console.log('[Broker] Retained messages:');
    for (const [topic, message] of this.retainedMessages.entries()) {
      console.log(`- Topic: "${topic}", Message: ${message}`);
    }
  }
}

module.exports = MQTTBroker;

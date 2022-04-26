
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse = (message) => {
    const text = message.toLowerCase();
    return this.actionProvider.handleDefault();
  };
}

export default MessageParser;
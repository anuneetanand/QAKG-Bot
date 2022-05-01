class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  handleDefault = () => {
    const message = this.createChatBotMessage("Sorry I didn't understand", {
      withAvatar: true,
    });
    this.addMessageToBotState(message);
  };

  handleSample = () => {
    const message = this.createChatBotMessage(
      '"What are routes of administration for drugs given to patients with Dyspnea?"',
      { withAvatar: true }
    );
    this.addMessageToBotState(message);
  };

  handleSpecificQuery = () => {
    const message = this.createChatBotMessage("Enter specific query");
    this.addMessageToBotState(message);
  };

  handleGeneralQuery = () => {
    const message = this.createChatBotMessage("Enter generic query");
    this.addMessageToBotState(message);
  };

  handleSpecificEntityId = (messageText) => {
    const message = this.createChatBotMessage(messageText);
    this.addMessageToBotState(message);
  };

  handleUserSelctedSpecificQuery = (specificQuery) => {};

  handleStop = () => {
    const message = this.createChatBotMessage("Glad to help :D", {
      withAvatar: true,
    });
    this.addMessageToBotState(message);
  };

  addMessageToBotState = (messages) => {
    if (Array.isArray(messages)) {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, ...messages],
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, messages],
      }));
    }
  };
}

export default ActionProvider;

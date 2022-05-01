import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;
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

  handleSampleQueriesSpecific = () => {
    const message = this.createChatBotMessage(
      "Select one of the following queries",
      {
        widget: "SampleQueriesSpecific",
      }
    );
    this.addMessageToBotState(message);
  };

  handleUserSelctedSpecificQuery = (specificQuery) => {
    console.log(specificQuery + " received yay");
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendSelectedSpecificQuery`, {
        params: { query: specificQuery },
      });
    }
    const message = this.createChatBotMessage("Is your query confirmed?", {
      widget: "ConfirmationSpecificQuery",
    });
    this.addMessageToBotState(message);
  };

  handleUserConfirmationSpecificQuery = (confirmation) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendConfirmationSpecificQuery`, {
        params: { choice: confirmation },
      });
    }
    if (confirmation === "Yes") {
      let queryResults = "2 people have disease";
      if (USING_BACKEND) {
        axios.get(`${backendURI}/getSpecificQueryResults`).then((res) => {
          queryResults = res["entity"];
        });
      }
      const message = this.createChatBotMessage(queryResults);
      this.addMessageToBotState(message);
    } else {
      const message = this.createChatBotMessage(
        "We apologize for the inconvenience :("
      );
      this.addMessageToBotState(message);
    }
  };

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

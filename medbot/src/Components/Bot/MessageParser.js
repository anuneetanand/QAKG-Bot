import "axios";
import axios from "axios";

const backendURI = "http://127.0.0.1:5000";
const USING_BACKEND = true;

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse = (message) => {
    const text = message.toLowerCase();
    const messageStack = this.state.messages.reverse();
    const lastMessage = messageStack[0].message;
    console.log(messageStack);
    if (lastMessage === "Enter specific query") {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendQuery`, {
          params: { query: message },
        });
      }
      return this.actionProvider.sendAnswerTypeSpecificQueryMessage();
    } else if (lastMessage === "Enter generic query") {
      console.log("Entered");
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendQuery`, {
          params: { query: message },
        });
      }
      return this.actionProvider.sendAnswerTypeGeneralizedQueryMessage();
    } else if (lastMessage.includes("Enter") && lastMessage.includes("id")) {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendPrimaryEntityID`, {
          params: { id: message },
        });
      }
      return this.actionProvider.handleSampleQueriesSpecific();
    } else if (
      lastMessage.includes("Enter") &&
      lastMessage.includes("value:")
    ) {
      const filterName = lastMessage.split(" ")[1];
      console.log(filterName + " " + message + " yo");
      this.actionProvider.saveUserEnteredFilterValue(filterName, message);
    }
  };
}

export default MessageParser;

import "axios";
import axios from "axios";

const USING_BACKEND = true;
const backendURI = "http://127.0.0.1:5000";
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse = (message) => {
    const messageStack = this.state.messages.reverse();
    const lastMessage = messageStack[0].message;

    if (lastMessage === "Enter your specific query") {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendQuery`, {
          params: { query: message },
        });
      }
      return this.actionProvider.sendAnswerTypeMessage();
    } 
    else if (lastMessage === "Enter your generic query") {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendQuery`, {
          params: { query: message },
        });
      }
      return this.actionProvider.sendAnswerTypeMessage();
    } 
    else if (lastMessage.includes("Enter the ID")) {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendPrimaryEntityID`, {
          params: { id: message },
        }).then(res => {return this.actionProvider.handleQueryTemplates();});
    }} else if (
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

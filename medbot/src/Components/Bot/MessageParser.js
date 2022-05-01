import "axios";
import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse = (message) => {
    const text = message.toLowerCase();
    const messageStack = this.state.messages.reverse();
    const lastMessage = messageStack[0].message;
    // console.log(messageStack);
    if (lastMessage === "Enter specific query") {
      let entityStr = "disease";
      if (USING_BACKEND) {
        axios
          .get(`${backendURI}/storeSpecificQueryAndReturnEntity`, {
            params: { query: message },
          })
          .then((res) => {
            entityStr = res["entity"];
          });
        entityStr = entityStr["entity"];
      }
      this.actionProvider.handleSpecificEntityId(`Enter ${entityStr} id`);
    } else if (lastMessage === "Enter generic query") {
    }

    if (lastMessage.includes("Enter") && lastMessage.includes("id")) {
      if (USING_BACKEND) {
        axios.post(`${backendURI}/storeEntityID`, { params: { id: message } });
      }
    }
  };
}

export default MessageParser;

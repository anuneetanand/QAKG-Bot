import { createChatBotMessage } from "react-chatbot-kit";
import Menu from "../Widgets/Menu.js";
import Avatar from "../Util/Avatar.js";
import SampleQueriesSpecific from "../Widgets/SampleQueriesSpecific.js";
import ConfirmationSpecificQuery from "../Widgets/ConfirmationSpecificQuery.js";

const config = {
  botName: "MedBot",
  initialMessages: [
    createChatBotMessage(
      `Hi! I'm MedBot. I can help you in querying data from Electronic Health Records.`
    ),
    createChatBotMessage("Please enter your query", {
      withAvatar: true,
      delay: 400,
      widget: "Menu",
    }),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#1982FC",
    },
    chatButton: {
      backgroundColor: "#1982FC",
    },
  },
  state: {},
  customComponents: { botAvatar: (props) => <Avatar {...props} /> },
  widgets: [
    {
      widgetName: "Menu",
      widgetFunc: (props) => <Menu {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "SampleQueriesSpecific",
      widgetFunc: (props) => <SampleQueriesSpecific {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "ConfirmationSpecificQuery",
      widgetFunc: (props) => <ConfirmationSpecificQuery {...props} />,
      mapStateToProps: ["messages"],
    },
  ],
};

export default config;

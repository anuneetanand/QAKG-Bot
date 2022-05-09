import Avatar from "../Util/Avatar.js";
import { createChatBotMessage } from "react-chatbot-kit";

import Menu from "../Widgets/Menu.js";
import AnswerType from "../Widgets/AnswerType.js";
import Confirmation from "../Widgets/Confirmation.js";
import QueryTemplates from "../Widgets/QueryTemplates.js";
import GenericQueryFilters from "../Widgets/GenericQueryFilters.js";
import GenericQueryEntities from "../Widgets/GenericQueryEntities.js";
import SpecificQueryEntities from "../Widgets/SpecificQueryEntities.js";
import RestartFlow from "../Widgets/RestartFlow.js";


const config = {
  botName: "MedBot",
  initialMessages: [
    createChatBotMessage(
      "Hi! I'm MedBot. I can help you in querying data from the electronic health records"
    ),
    createChatBotMessage("Please choose the query type", {
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
      widgetName: "AnswerType",
      widgetFunc: (props) => <AnswerType {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "Confirmation",
      widgetFunc: (props) => <Confirmation {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "QueryTemplates",
      widgetFunc: (props) => <QueryTemplates {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "GenericQueryFilters ",
      widgetFunc: (props) => <GenericQueryFilters {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "GenericQueryEntities ",
      widgetFunc: (props) => <GenericQueryEntities  {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "RestartFlow",
      widgetFunc: (props) => <RestartFlow {...props} />,
      mapStateToProps: ["messages"],
    },

    {
      widgetName: "SpecificQueryEntities",
      widgetFunc: (props) => <SpecificQueryEntities {...props} />,
      mapStateToProps: ["messages"],
    },


  ],
};

export default config;

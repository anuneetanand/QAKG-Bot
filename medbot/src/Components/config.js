import { createChatBotMessage } from 'react-chatbot-kit';
import Menu from './Widgets/Menu.js';

const config = {
  botName: 'MedBot',
  initialMessages: [
    createChatBotMessage(
      `Hi! I'm MedBot. I can help you in querying data from the Electronic Health Records.`
    ),
    createChatBotMessage(
      "Please enter your query",
      {
        withAvatar: true,
        delay: 400,
        widget: "Menu"
      }
    )
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#1982FC',
    },
    chatButton: {
      backgroundColor: '#1982FC',
    },
  },
  state: {},
  // customComponents: { botAvatar: (props) => <CoBotAvatar {...props} /> },
  widgets: [
    {
      widgetName: "Menu",
      widgetFunc: (props) => <Menu {...props} />,
      mapStateToProps: ["messages"]
    },
  ]
};

export default config;

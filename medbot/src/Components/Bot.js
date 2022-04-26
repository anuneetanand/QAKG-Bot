import 'react-chatbot-kit/build/main.css'
import config from './config.js';
import Chatbot from 'react-chatbot-kit'
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';

const Bot = () => {

  const saveMessages = (messages, HTMLString) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('chat_messages'));
    return messages;
  };

  return (
    <div>
      <Chatbot
        config={config}
        headerText='MedBot'
        placeholderText='Enter your message here...'
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        saveMessages={saveMessages}
        loadMessages={loadMessages}
        messageHistory={loadMessages()}
        runInitialMessagesWithHistory={true}
      />
    </div>
  );
};

export default Bot;
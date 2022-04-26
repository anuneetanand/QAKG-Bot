import 'react-chatbot-kit/build/main.css'
import config from './config.js';
import Chatbot from 'react-chatbot-kit'
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';


const Bot = () => {
  return (
    <div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
};

export default Bot;
import React from "react";
import BotIcon from "../../Assets/BotIcon.png";

const Avatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar"
        style={{ width : "20%"}}>
      <div
        className="react-chatbot-kit-chat-bot-avatar-container"
        style={{ width: "90%", background:"black"}}>
        <img alt="BotIcon" src={BotIcon} 
        style = {{width:"80%"}} />
      </div>
    </div>
  );
};

export default Avatar;
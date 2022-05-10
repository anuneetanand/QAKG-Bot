import React from "react";
import BotIcon from "../../Assets/bot.png";

const Avatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar"
        style={{ width : "25%"}}>
      <div
        className="react-chatbot-kit-chat-bot-avatar-container"
        style={{ width: "90%", background:"white"}}>
        <img alt="BotIcon" src={BotIcon} 
        style = {{width:"100%"}} />
      </div>
    </div>
  );
};

export default Avatar;
import React, { useRef } from "react";
import { useChatStore } from "../../../store/useChatStore";
import UniversalMessageInput from "../../UniversalMessageInput";

function MessageInput() {
  const { sendMessage, doSomething, selectedFriend } = useChatStore();
  const typingTimeoutRef = useRef(null);

  const handleTyping = (action) => {
    if (selectedFriend) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      doSomething(action || "typing");
      typingTimeoutRef.current = setTimeout(() => {
        doSomething("stop-typing");
      }, 500);
    }
  };

  const handleStopTyping = () => {
    if (selectedFriend) {
      doSomething("stop-recording");
    }
  };

  return (
    <UniversalMessageInput
      sendMessage={sendMessage}
      onTyping={handleTyping}
      onStopTyping={handleStopTyping}
      disabled={!selectedFriend}
    />
  );
}

export default MessageInput;

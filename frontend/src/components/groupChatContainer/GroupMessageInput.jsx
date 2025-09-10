import React from "react";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import UniversalMessageInput from "../UniversalMessageInput";

function GroupMessageInput() {
  const { sendGroupMessage, selectedGroup } = useGroupChatStore();

  return (
    <UniversalMessageInput
      sendMessage={sendGroupMessage}
      disabled={!selectedGroup}
    />
  );
}

export default GroupMessageInput;

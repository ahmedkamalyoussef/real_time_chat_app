import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import GroupChatHeader from "./chatHeader/GroupChatHeader";
import GroupMessageInput from "./GroupMessageInput";
import MessageItem from "../chatContainer/messages/MessageItem";
import MessageSkeleton from "../chatContainer/messageSkeleton/MessageSkeleton";
import { formatMessageTime } from "../../utils/utils";

const GroupChatContainer = () => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
    subscribeToGroupSocket,
    unsubscribeFromGroupSocket,
  } = useGroupChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) return;
    getGroupMessages(selectedGroup._id);
    subscribeToGroupSocket();

    return () => unsubscribeFromGroupSocket();
  }, [selectedGroup?._id,getGroupMessages,subscribeToGroupSocket,unsubscribeFromGroupSocket]);

  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader title={selectedGroup?.name} />
        <MessageSkeleton />
        <GroupMessageInput isGroup />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader title={selectedGroup?.name} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages.map((message) => (
          <div key={message._id} className="relative">
            <div
              className={`chat ${
                message.senderId._id === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={message.senderId.profilePicture}
                    alt={message.senderId.firstName}
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <span className="font-bold text-sm mr-1">
                  {message.senderId.firstName +" " + message.senderId.lastName}
                </span>
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <MessageItem message={message} authUser={authUser} />
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <GroupMessageInput isGroup groupId={selectedGroup?._id} />
    </div>
  );
};

export default GroupChatContainer;

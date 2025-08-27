import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./chatHeader/ChatHeader";
import MessageInput from "./messageInput/MessageInput";
import MessageItem from "./messages/MessageItem"; 
import MessageSkeleton from "./messageSkeleton/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../utils/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedFriend,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedFriend._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedFriend._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className="relative">
            {/* MessageItem مع الصورة والوقت */}
            <div className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
              {/* صورة المرسل */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePicture 
                        : selectedFriend.profilePicture
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              
              {/* وقت الإرسال */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              
              {/* استخدم MessageItem للمحتوى فقط */}
              <MessageItem message={message} authUser={authUser} />
            </div>
          </div>
        ))}
        {/* نقطة التمرير للأسفل */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
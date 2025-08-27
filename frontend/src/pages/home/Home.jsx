import { useChatStore } from "../../store/useChatStore";
import { useGroupChatStore } from "../../store/useGroupChatStore";
import Sidebar from "../../components/sidebar/Sidebar";
import NoChatSelected from "../../components/noChatSelected/NoChatSelected";
import ChatContainer from "../../components/chatContainer/ChatContainer";
import GroupChatContainer from "../../components/groupChatContainer/GroupChatContainer";

function Home() {
  const { selectedFriend } = useChatStore();
  const { selectedGroup } = useGroupChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedFriend && !selectedGroup ? (
              <NoChatSelected />
            ) : selectedFriend ? (
              <ChatContainer />
            ) : (
              <GroupChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import { X, Mic } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useFriendsStore } from "../../../store/useFriendsStore";

const ChatHeader = () => {
  const { selectedFriend, setSelectedFriend, isDoingSomething, somethingDoingType } = useChatStore();
  const { onlineFriends } = useFriendsStore();

  // Function to get status text and color
  const getStatusInfo = () => {
    if (isDoingSomething) {
      switch (somethingDoingType) {
        case "typing":
          return { text: "Typing...", color: "text-blue-500" };
        case "recording":
        case "recording...": // Handle both formats
          return { text: "Recording...", color: "text-red-500" };
        default:
          return { 
            text: onlineFriends.includes(selectedFriend?._id) ? "Online" : "Offline",
            color: onlineFriends.includes(selectedFriend?._id) ? "text-green-500" : "text-gray-400"
          };
      }
    }
    
    return {
      text: onlineFriends.includes(selectedFriend?._id) ? "Online" : "Offline",
      color: onlineFriends.includes(selectedFriend?._id) ? "text-green-500" : "text-gray-400"
    };
  };

  const statusInfo = getStatusInfo();
  const isRecording = somethingDoingType === "recording" || somethingDoingType === "recording...";

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedFriend?.profilePicture} alt={selectedFriend?.fullName} />
              {/* Online indicator */}
              {onlineFriends.includes(selectedFriend?._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {`${selectedFriend?.firstName} ${selectedFriend?.lastName}`}
            </h3>
            <div className="flex items-center gap-1">
              {/* Recording icon */}
              {isRecording && (
                <Mic className="w-3 h-3 text-red-500 animate-pulse" />
              )}
              <p className={`text-sm ${statusInfo?.color}`}>
                {statusInfo?.text}
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedFriend(null)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
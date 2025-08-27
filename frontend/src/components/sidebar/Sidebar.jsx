import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../../store/useChatStore";
import SidebarSkeleton from "./sidebarSkeleton/SidebarSkeleton";
import { Users, UserPlus, ChevronRight, ChevronLeft, Mic } from "lucide-react";
import { useFriendsStore } from "../../store/useFriendsStore";
import { useGroupsStore } from "../../store/useGroupsStore";
import { useGroupChatStore } from "../../store/useGroupChatStore";

const Sidebar = () => {
  const { onlineFriends, getFriends, friends, isFriendsLoading } = useFriendsStore();
  const { selectedFriend, setSelectedFriend, isDoingSomething, somethingDoingType } = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { groups, getMyGroups, isLoadingGroups } = useGroupsStore();
  const { setSelectedGroup } = useGroupChatStore();

  useEffect(() => {
    getFriends();
    getMyGroups();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Desktop دائمًا expanded، الموبايل يبدأ مطوي
      setIsExpanded(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, [getFriends, getMyGroups]);

  // Filter friends dynamically
  const filteredFriends = useMemo(() => {
    return showOnlineOnly
      ? friends.filter((friend) => onlineFriends.includes(friend._id))
      : friends;
  }, [friends, onlineFriends, showOnlineOnly]);

  const getUserStatus = (user) => {
    if (selectedFriend?._id === user._id && isDoingSomething) {
      switch (somethingDoingType) {
        case "typing":
          return { text: "Typing...", color: "text-blue-500" };
        case "recording":
        case "recording...":
          return { text: "Recording...", color: "text-red-500" };
        default:
          return {
            text: onlineFriends.includes(user._id) ? "Online" : "Offline",
            color: onlineFriends.includes(user._id) ? "text-green-500" : "text-zinc-400"
          };
      }
    }
    return {
      text: onlineFriends.includes(user._id) ? "Online" : "Offline",
      color: onlineFriends.includes(user._id) ? "text-green-500" : "text-zinc-400"
    };
  };

  if (isFriendsLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside
        className={`
          h-full border-r border-base-300 flex flex-col transition-all duration-300 overflow-hidden
          ${isMobile ? (isExpanded ? "w-full fixed left-0 top-0 z-50 h-screen bg-base-100" : "w-20") : "w-72"}
        `}
      >
        {/* Header */}
        <div className="border-b border-base-300 w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            {(isExpanded || !isMobile) && (
              <>
                <span className="font-medium hidden lg:block">Contacts</span>
                <span className="font-medium hidden sm:block lg:hidden">{isExpanded ? "Contacts" : ""}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(isExpanded || !isMobile) && (
              <button
                onClick={() => document.getElementById('create-group-modal')?.showModal()}
                className="btn btn-ghost btn-sm"
                title="Create Group"
              >
                <UserPlus className="size-5" />
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="btn btn-xs btn-ghost"
              >
                {isExpanded ? <ChevronLeft /> : <ChevronRight />}
              </button>
            )}
          </div>
        </div>

        {/* Online filter */}
        {(isExpanded || !isMobile) && (
          <div className="mt-3 items-center gap-2 px-4 flex">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineFriends.length} online)</span>
          </div>
        )}

        {/* Friends List */}
        <div className="overflow-y-auto w-full py-3 flex-1">
          {filteredFriends.map(user => {
            const statusInfo = getUserStatus(user);
            const isRecording = selectedFriend?._id === user._id &&
              (somethingDoingType === "recording" || somethingDoingType === "recording...");

            return (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedFriend(user);
                  if (isMobile) setIsExpanded(false);
                }}
                className={`
                  w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                  ${selectedFriend?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineFriends.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>

                {(isExpanded || !isMobile) && (
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium truncate">{user.firstName + " " + user.lastName}</div>
                    <div className={`text-sm ${statusInfo.color} flex items-center gap-1`}>
                      {isRecording && <Mic className="w-3 h-3 animate-pulse" />}
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {(isExpanded || !isMobile) && (
            <div className="px-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-5" />
                <span className="font-medium">Groups</span>
              </div>
            </div>
          )}

          <div className="overflow-y-auto w-full pb-3">
            {groups.map(group => (
              <button
                key={group._id}
                onClick={() => {
                  setSelectedGroup(group);
                  if (isMobile) setIsExpanded(false);
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={group.groupPicture || "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"}
                    alt={group.name}
                    className="size-12 object-cover rounded-full"
                  />
                </div>
                {(isExpanded || !isMobile) && (
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium truncate">{group.name}</div>
                    <div className="text-sm text-zinc-400">
                      {group.members?.length || 0} members
                    </div>
                  </div>
                )}
              </button>
            ))}

            {groups.length === 0 && !isLoadingGroups && (
              <div className="text-center text-zinc-500 py-2">No groups yet</div>
            )}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              {showOnlineOnly ? "No online users" : "No users found"}
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is expanded */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

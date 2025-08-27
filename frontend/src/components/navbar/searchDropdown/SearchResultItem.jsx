import React, { useState } from 'react';
import { useFriendsStore } from '../../../store/useFriendsStore';
import { UserPlus, Check, X } from 'lucide-react';

function SearchResultItem({ user }) {
  const { sendFriendRequest,resetSearchResults } = useFriendsStore();
  const [isLoading, setIsLoading] = useState(false);
  console.log(user)

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      await sendFriendRequest(user._id);
      resetSearchResults();
    } catch (error) {
      console.error('Failed to send friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const renderActionButton = () => {
    if (isLoading) {
      return (
        <div className="btn btn-sm btn-disabled">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (user.status) {
      case 'none':
        return (
          <button
            onClick={handleSendRequest}
            className="btn btn-sm btn-primary gap-1"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </button>
        );

      case "pending_sent":
        return (
          <div className="btn btn-sm btn-disabled">
            Request Sent
          </div>
        );


      case "friend":
        return (
          <div className="btn btn-sm btn-disabled">
            Friends
          </div>
        );

      default:
        return (
          <button
            onClick={handleSendRequest}
            className="btn btn-sm btn-primary gap-1"
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-2 sm:p-3 hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0">
  {/* User avatar + info */}
  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
    <div className="avatar flex-shrink-0">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
        <img
          src={user.profilePicture}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="flex flex-col min-w-0 flex-1">
      <div className="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">
        {user.firstName} {user.lastName}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
        @{user.handle}
      </div>
    </div>
  </div>

  {/* Action button */}
  <div className="ml-2 sm:ml-3 flex-shrink-0">
    <div className="hidden sm:block">{renderActionButton()}</div>
    <div className="sm:hidden">
      {/* نسخة مبسطة في الموبايل: أيقونة بس */}
      {user.status === "friend" ? (
        <div className="btn btn-xs btn-disabled">✓</div>
      ) : user.status === "pending_sent" ? (
        <div className="btn btn-xs btn-disabled">…</div>
      ) : (
        <button
          onClick={handleSendRequest}
          className="btn btn-xs btn-primary"
        >
          <UserPlus className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
</div>

  );
}

export default SearchResultItem;
import React, { useEffect } from 'react';
import { useFriendsStore } from '../../../store/useFriendsStore';
import FriendRequestItem from './FriendRequestItem';
import { Loader2, X, Users } from 'lucide-react';

function FriendRequestsDropdown({ onClose }) {
  const { friendRequests, getFriendRequests, loading } = useFriendsStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-base-300 bg-base-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Friend Requests</h3>
          {/* شيلت الكاونتر من هنا */}
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-base-300 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Loading requests...</span>
          </div>
        )}

        {!loading && friendRequests.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No friend requests</p>
            <p className="text-sm">When someone sends you a friend request, it will appear here.</p>
          </div>
        )}

        {!loading && friendRequests.length > 0 && (
          <div>
            {friendRequests.map((request) => (
              <FriendRequestItem 
                key={request._id} 
                request={request}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequestsDropdown;
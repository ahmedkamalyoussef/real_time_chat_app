import React, { useState } from 'react';
import { useFriendsStore } from '../../../store/useFriendsStore';
import { Check, X, Loader2 } from 'lucide-react';

function FriendRequestItem({ request, onClose }) {
  const { acceptFriendRequest, rejectFriendRequest, getFriendRequests } = useFriendsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleAccept = async () => {
    setIsLoading(true);
    setActionType('accept');
    try {
      await acceptFriendRequest(request.requester._id);
      // Refresh the friend requests list
      await getFriendRequests();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    } finally {
      setIsLoading(false);
      setActionType('');
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    setActionType('reject');
    try {
      await rejectFriendRequest(request.requester._id);
      // Refresh the friend requests list
      await getFriendRequests();
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    } finally {
      setIsLoading(false);
      setActionType('');
    }
  };

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const requestTime = new Date(createdAt);
    const diffInHours = Math.floor((now - requestTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-base-50 transition-colors border-b border-base-200 last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full">
            <img 
              src={request.requester.profilePicture} 
              alt={`${request.requester.firstName} ${request.requester.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="font-medium truncate">
            {request.requester.firstName} {request.requester.lastName}
          </div>
          <div className="text-sm text-gray-500 truncate">
            @{request.requester.handle}
          </div>
          <div className="text-xs text-gray-400">
            {formatTimeAgo(request.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 ml-3 flex-shrink-0">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="btn btn-sm btn-success gap-1 min-w-[80px]"
        >
          {isLoading && actionType === 'accept' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Accept
            </>
          )}
        </button>
        
        <button
          onClick={handleReject}
          disabled={isLoading}
          className="btn btn-sm btn-error gap-1 min-w-[80px]"
        >
          {isLoading && actionType === 'reject' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <X className="w-4 h-4" />
              Reject
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default FriendRequestItem;
import React, { useEffect } from 'react';
import { useFriendsStore } from '../../../store/useFriendsStore';
import { Users } from 'lucide-react';

function RequestsButtonWithCount({ onClick, isActive }) {
  const { friendRequests, getFriendRequests } = useFriendsStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
        transition-colors duration-200
        ${isActive 
          ? 'bg-base-300 text-base-content' 
          : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
        }
      `}
    >
      <Users className="w-4 h-4" />
      Requests
      
      {/* الكاونتر Badge */}
      {friendRequests.length > 0 && (
        <span className="
          absolute -top-2 -right-2 
          bg-error text-error-content text-xs 
          rounded-full h-5 w-5 
          flex items-center justify-center 
          min-w-[20px] font-bold
          shadow-md
        ">
          {friendRequests.length > 99 ? '99+' : friendRequests.length}
        </span>
      )}
    </button>
  );
}

export default RequestsButtonWithCount;
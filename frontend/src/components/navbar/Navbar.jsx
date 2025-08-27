import React, { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useFriendsStore } from '../../store/useFriendsStore'
import { Link } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchDropdown from './searchDropdown/SearchDropdown';
import FriendRequestsDropdown from './friendRequestsDropdown/FriendRequestsDropdown';

function Navbar() {
  const { logout, authUser } = useAuthStore();
  const { friendRequests, getFriendRequests } = useFriendsStore(); // استخدم friendRequests بدل requestCount
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const searchRef = useRef(null);
  const requestsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (requestsRef.current && !requestsRef.current.contains(event.target)) {
        setShowFriendRequests(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load friend requests when component mounts
  useEffect(() => {
    if (authUser) {
      getFriendRequests();
    }
  }, [authUser, getFriendRequests]);

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className="size-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className='text-lg font-bold'>Chatty</h1>
            </Link>
          </div>

          {/* Search Section */}

          <div className="flex items-center gap-2">
            {/* Friend Requests Button */}
            {authUser && (
              <>
                <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" onClick={() => setShowSearch(true)} />
                  </div>
                  {showSearch && (
                    <div className="absolute left-0 mt-6 w-full min-w-[200px] max-w-sm bg-base-100 shadow-lg rounded-lg z-50">
                      <SearchDropdown onClose={() => setShowSearch(false)} />
                    </div>
                  )}


                </div>
                <div className="relative" ref={requestsRef}>
                  <button
                    onClick={() => setShowFriendRequests(!showFriendRequests)}
                    className="btn btn-sm gap-2 transition-colors relative"
                  >
                    <Users className='w-4 h-4' />
                    <span className='hidden sm:inline'>Requests</span>
                    {/* استخدم friendRequests.length بدل requestCount */}
                    {friendRequests.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {friendRequests.length > 9 ? '9+' : friendRequests.length}
                      </div>
                    )}
                  </button>
                  {showFriendRequests && (
                    <FriendRequestsDropdown onClose={() => setShowFriendRequests(false)} />
                  )}
                </div>
              </>
            )}

            <Link to={'/settings'} className='btn btn-sm gap-2 transition-colors'>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>
            {
              authUser && (
                <>
                  <Link to={"/profile"} className='btn btn-sm gap-2'>
                    <User className='size-5' />
                    <span className='hidden sm:inline'>Profile</span>
                  </Link>
                  <button className='flex gap-2 items-center' onClick={() => logout(navigate)}>
                    <LogOut className='size-5' />
                    <span className='hidden sm:inline'>Logout</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
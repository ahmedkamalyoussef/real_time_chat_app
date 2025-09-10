import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useFriendsStore } from "../../store/useFriendsStore";
import { Link } from "react-router-dom";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Search,
  Users,
  UserPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "./searchDropdown/SearchDropdown";
import FriendRequestsDropdown from "./friendRequestsDropdown/FriendRequestsDropdown";

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load friend requests when component mounts
  useEffect(() => {
    if (authUser) {
      getFriendRequests();
    }
  }, [authUser, getFriendRequests]);

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold hidden sm:block">Chatty</h1>
            </Link>
          </div>

          {/* Center: Search for Desktop */}
          {authUser && (
            <div className="hidden md:flex flex-1 justify-center px-4">
              <div className="relative w-full max-w-md" ref={searchRef}>
                <div
                  className="lg:ml-8 flex items-center w-full bg-base-200 rounded-full px-4 py-2 cursor-text"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className=" w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 ml-2">Search...</span>
                </div>
                {showSearch && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-base-100 shadow-lg rounded-lg z-50">
                    <SearchDropdown onClose={() => setShowSearch(false)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side: Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            {authUser && (
              <>
                {/* Mobile Search Button */}
                <div className="md:hidden" ref={searchRef}>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="btn btn-ghost btn-circle btn-sm"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  {showSearch && (
                    <div className="absolute top-full right-2 mt-2 w-72 bg-base-100 shadow-lg rounded-lg z-50">
                      <SearchDropdown onClose={() => setShowSearch(false)} />
                    </div>
                  )}
                </div>

                {/* Friend Requests Button */}
                <div className="relative" ref={requestsRef}>
                  <button
                    onClick={() => setShowFriendRequests(!showFriendRequests)}
                    className="btn btn-sm gap-1 sm:gap-2 transition-colors relative px-2 sm:px-3"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Requests</span>
                    {friendRequests.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {friendRequests.length > 9
                          ? "9+"
                          : friendRequests.length}
                      </div>
                    )}
                  </button>
                  {showFriendRequests && (
                    <FriendRequestsDropdown
                      onClose={() => setShowFriendRequests(false)}
                    />
                  )}
                </div>
              </>
            )}

            {/* Settings, Profile, Logout */}
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && (
              <>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-8 rounded-full">
                      <img alt="User avatar" src={authUser.profilePicture} />
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                    <li>
                      <Link to={"/profile"} className="justify-between">
                        Profile
                        <UserPen size={16} />
                      </Link>
                    </li>
                    <li><a className="justify-between" onClick={() => logout(navigate)}><span>Logout </span><LogOut size={16} /></a></li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

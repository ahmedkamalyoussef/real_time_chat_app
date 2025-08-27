import React, { useState, useEffect } from 'react';
import { useFriendsStore } from '../../../store/useFriendsStore';
import SearchResultItem from './SearchResultItem';
import { Loader2, X } from 'lucide-react';

function SearchDropdown({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, searchFriend, loading } = useFriendsStore();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchFriend(searchQuery.trim());
      }
    }, 500); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchFriend]);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between p-3 border-b border-base-300">
        <input
          type="text"
          placeholder="Search by name or handle..."
          className="w-full p-2 border border-base-300 rounded-md focus:outline-none focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <button 
          onClick={onClose}
          className="ml-2 p-1 hover:bg-base-200 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div>
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="ml-2">Searching...</span>
          </div>
        )}

        {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            <div className="p-2 text-sm text-gray-500 font-medium border-b border-base-300">
              Search Results
            </div>
            {searchResults.map((user) => (
              <SearchResultItem key={user._id} user={user} />
            ))}
          </div>
        )}

        {searchQuery.trim().length < 2 && (
          <div className="p-4 text-center text-gray-500">
            Type at least 2 characters to search
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchDropdown;
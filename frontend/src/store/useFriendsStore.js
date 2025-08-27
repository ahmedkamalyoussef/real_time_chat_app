import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFriendsStore = create((set, get) => ({
    friends: [],
    searchResults: [],
    isFriendsLoading: false,
    onlineFriends: [],
    requests: [],
    requestCount: 0,
    friendRequests: [],

    resetSearchResults: () => set({ searchResults: [] }),

    getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get('/friends/requests');
      set({ 
        friendRequests: res.data.requests,
        requestCount: res.data.cout || res.data.requests.length 
      });
      set({friendRequests: res.data.requests, requestCount: res.data.count});
      console.log("Friend requests fetched successfully:", res.data.requests);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to fetch friend requests");
      set({ friendRequests: [], requestCount: 0 });
    }
  },

    setOnlineFriends: (userIds) => set({ onlineFriends: userIds }),

    searchFriend: async (handleToSearch) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get(`/friends/search?q=${encodeURIComponent(handleToSearch)}`);
            set({ searchResults: res.data });
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to search friend");
        } finally {
            set({ loading: false });
        }
    },


    sendFriendRequest: async (recipientId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post(`/friends/send/${recipientId}`);
            toast.success("Friend request sent");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to send request");
        } finally {
            set({ loading: false });
        }
    },

    acceptFriendRequest: async (requesterId) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.patch(`/friends/accept/${requesterId}`);
            toast.success("Friend request accepted");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to accept request");
        } finally {
            set({ loading: false });
        }
    },

    rejectFriendRequest: async (requesterId) => {
        set({ loading: true });
        try {
            await axiosInstance.post(`/friends/reject/${requesterId}`);
            toast.success("Friend request rejected ❌");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to reject request");
        } finally {
            set({ loading: false });
        }
    },

    getFriends: async () => {
        set({ isFriendsLoading: true });
        try {
            const res = await axiosInstance.get('friends/');
            set({ friends: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isFriendsLoading: false });
        }
    },
}));

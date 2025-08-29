import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useFriendsStore } from "./useFriendsStore";
import { useChatStore } from "./useChatStore";
import { useGroupsStore } from "./useGroupsStore";
import { useGroupChatStore } from "./useGroupChatStore";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfilePic: false,
  isCheckingAuth: true,
  socket: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
      // console.log("err in check",error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/signup", data);
      set({ authUser: res.data });
      toast.success("account created successfully");
      if (navigate) navigate("/");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async (navigate) => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("loged out successfully");
      if (navigate) navigate("/login");
      get().disConnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async (data, navigate, location) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });
      // toast.success("loged in successfully");
      if (navigate && location && location.pathname === "/login") navigate("/");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogingIn: false });
    }
  },
  updateProfilePic: async (data) => {
    set({ isUpdatingProfilePic: true });
    try {
      const res = await axiosInstance.patch("auth/update-profile-pic", data);
      set({ authUser: res.data });
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },
  connectSocket: () => {
    if (get().socket?.connected || !get().authUser) return;
    const socket = io(SOCKET_URL, {
      query: { userId: get().authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      useFriendsStore.getState().setOnlineFriends(userIds);
    });
    socket.on("newFriendRequest", () => {
      useFriendsStore.getState().getFriendRequests();
      useFriendsStore.getState().resetSearchResults();
    });
    socket.on("friendRequestAccepted", () => {
      useFriendsStore.getState().getFriends();
    });
    useChatStore.getState().subscripeToDoingSomething();

    const groups = useGroupsStore.getState().groups;
    if (groups?.length) {
      groups.forEach((g) => socket.emit("joinGroup", g._id));
    } else {
      useGroupsStore.getState().getMyGroups();
    }

    useGroupChatStore.getState().subscribeToGroupSocket();

    console.log("connected to socket server");
  },

  disConnectSocket: () => {
    if (!get().socket?.connected) return;
    useGroupChatStore.getState().unsubscribeFromGroupSocket();

    get().socket.disconnect();
    set({ socket: null });
    console.log("disconnected from socket server");
  },
}));

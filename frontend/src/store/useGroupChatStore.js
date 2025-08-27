import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useGroupChatStore = create((set, get) => ({
  selectedGroup: null,
  groupMessages: [],
  isGroupMessagesLoading: false,

  setSelectedGroup: (group) => {
    set({ selectedGroup: group, groupMessages: [] });
    get().getGroupMessages(group._id);
    useChatStore.getState().setSelectedFriend(null);
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async ({ content, media, type }) => {
    const { selectedGroup, groupMessages } = get();
    if (!selectedGroup) return;

    try {
      const res = await axiosInstance.post(`/messages/send`, {
        content,
        media,
        type,
        groupId: selectedGroup._id,
      });

      set({ groupMessages: [...groupMessages, res.data] });

      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("sendGroupMessage", res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToGroupSocket: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newGroupMessage");

    socket.on("newGroupMessage", (newMsg) => {
      const { selectedGroup } = get();
      if (selectedGroup && newMsg.groupId === selectedGroup._id) {
        get().getGroupMessages(selectedGroup._id);
        set(state => ({ groupMessages: [...state.groupMessages, newMsg] }));
      }
    });
  },

  unsubscribeFromGroupSocket: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newGroupMessage");
  },
}));

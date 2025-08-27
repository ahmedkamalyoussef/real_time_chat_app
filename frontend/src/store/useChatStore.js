import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    isMessagesLoading: false,
    selectedFriend: null,
    isDoingSomething: false,
    somethingDoingType: null,

    doSomething: async (type) => {
        const { selectedFriend } = get();
        if (!selectedFriend?._id) {
            console.warn('No friend selected or invalid friend data');
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/messages/doSomeThing/${selectedFriend._id}`,
                { type }
            );
        } catch (error) {
            console.error("Error in doSomething:", error.response?.data || error.message);
            return null;
        }
    },
    subscripeToDoingSomething: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.on('userDoSomething', ({ senderId, type }) => {
            const selectedFriend = get().selectedFriend;
            // if (selectedFriend && selectedFriend._id === senderId) {
            set({ isDoingSomething: true, somethingDoingType: type });
            // }
        }
        )
    },
    unSubscripeToDoingSomething: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off('userDoSomething');
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data, selectedUser: userId });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },


    sendMessage: async (messageData) => {
        const { messages, selectedFriend } = get();
        if (!selectedFriend) return;

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedFriend._id}`,
                messageData
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },


    setSelectedFriend: (user) => {
        set({ selectedFriend: user });
    },

    subscribeToMessages: () => {
        const selectedFriend = get().selectedFriend;
        if (!selectedFriend) return;

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId === selectedFriend._id) {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off('newMessage');
    }
}));
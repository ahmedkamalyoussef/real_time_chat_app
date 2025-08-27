import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupsStore = create((set, get) => ({
  groups: [],
  isLoadingGroups: false,

  getMyGroups: async () => {
    set({ isLoadingGroups: true });
    try {
      const res = await axiosInstance.get("/groups/my");
      set({ groups: res.data || [] });

      const socket = useAuthStore.getState().socket;
      if (socket && res.data?.length) {
        res.data.forEach(g => socket.emit("joinGroup", g._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isLoadingGroups: false });
    }
  },

  createGroup: async ({ name, description, imageBase64, memberIds }) => {
    try {
      const payload = {
        name,
        description,
        members: memberIds,
        groupPicture: imageBase64,
      };
      const res = await axiosInstance.post("/groups", payload);

      set(state => ({ groups: [res.data, ...state.groups] }));

      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroup", res.data._id);

      toast.success("Group created");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
      throw err;
    }
  },

  getInviteLink: async (groupId) => {
    try {
      console.log(groupId)
      const res = await axiosInstance.get(`/groups/${groupId}/invite-link`);
      return res.data?.inviteUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch invite link");
      return null;
    }
  },

  addMembers: async (groupId, memberIds) => {
    try {
      console.log(memberIds)
      await axiosInstance.post(`/groups/${groupId}/add-members`, {
        userIds: memberIds,
      });
      toast.success("Members added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add members");
    }
  },

}));

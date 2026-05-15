import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // ── 1-on-1 state ──────────────────────────────────────────────────────────
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  // ── Group state ────────────────────────────────────────────────────────────
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  // ── Generic setters ────────────────────────────────────────────────────────
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) =>
    set({ selectedUser, selectedGroup: null }),
  setSelectedGroup: (selectedGroup) =>
    set({ selectedGroup, selectedUser: null }),

  // ── 1-on-1 actions ─────────────────────────────────────────────────────────
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      isRead: false,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({
        messages: messages.filter((m) => m._id !== tempId).concat(res.data),
      });
    } catch (error) {
      set({ messages }); // roll back
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  markMessagesAsRead: async (senderId) => {
    try {
      await axiosInstance.put(`/messages/read/${senderId}`);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.senderId === senderId && !m.isRead
            ? { ...m, isRead: true, readAt: new Date().toISOString() }
            : m
        ),
      }));
    } catch (error) {
      console.error("Failed to mark as read:", error.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });

      if (isSoundEnabled) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch((e) => console.log("Audio play failed:", e));
      }

      get().markMessagesAsRead(newMessage.senderId);
    });

    socket.on("messagesRead", ({ readBy }) => {
      if (readBy === selectedUser._id) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.senderId === useAuthStore.getState().authUser._id && !m.isRead
              ? { ...m, isRead: true }
              : m
          ),
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesRead");
  },

  // ── Group actions ──────────────────────────────────────────────────────────

  fetchMyGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/my-groups");
      set({ groups: res.data });

      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("joinGroups", res.data.map((g) => g._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async ({ name, description, memberIds }) => {
    try {
      const res = await axiosInstance.post("/groups/create", {
        name,
        description,
        memberIds,
      });
      const newGroup = res.data;
      set((state) => ({ groups: [newGroup, ...state.groups] }));

      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroups", [newGroup._id]);

      toast.success(`Group "${newGroup.name}" created!`);
      return newGroup;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      return null;
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedGroup) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: { _id: authUser._id, fullName: authUser.fullName, profilePic: authUser.profilePic },
      groupId: selectedGroup._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ groupMessages: [...groupMessages, optimistic] });

    try {
      const res = await axiosInstance.post(
        `/messages/group/send/${selectedGroup._id}`,
        messageData
      );
      set({
        groupMessages: groupMessages.filter((m) => m._id !== tempId).concat(res.data),
      });
    } catch (error) {
      set({ groupMessages });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup, isSoundEnabled } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;
      set({ groupMessages: [...get().groupMessages, newMessage] });

      if (isSoundEnabled) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    });

    socket.on("groupCreated", (group) => {
      set((state) => {
        const exists = state.groups.find((g) => g._id === group._id);
        if (exists) return {};
        return { groups: [group, ...state.groups] };
      });
      socket.emit("joinGroups", [group._id]);
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
    socket.off("groupCreated");
  },
}));

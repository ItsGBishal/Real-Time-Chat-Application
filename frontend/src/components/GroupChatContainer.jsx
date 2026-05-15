import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function GroupChatContainer() {
  const {
    selectedGroup,
    groupMessages,
    isGroupMessagesLoading,
    getGroupMessages,
    sendGroupMessage,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) return;
    getGroupMessages(selectedGroup._id);
    subscribeToGroupMessages();
    return () => unsubscribeFromGroupMessages();
  }, [selectedGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (!selectedGroup) return null;

  return (
    <>
      <GroupChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isGroupMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : groupMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-slate-400">
              No messages yet. Say hi to{" "}
              <span className="text-cyan-400 font-medium">{selectedGroup.name}</span>!
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {groupMessages.map((msg) => {
              const senderId =
                typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
              const senderName =
                typeof msg.senderId === "object" ? msg.senderId.fullName : "Unknown";
              const senderPic =
                typeof msg.senderId === "object" ? msg.senderId.profilePic : null;

              const isOwn =
                senderId === authUser._id || senderId?.toString() === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
                >
                  {!isOwn && (
                    <div className="chat-image avatar">
                      <div className="w-8 rounded-full">
                        <img src={senderPic || "/avatar.png"} alt={senderName} />
                      </div>
                    </div>
                  )}

                  <div className="chat-header mb-1">
                    {!isOwn && (
                      <span className="text-xs text-cyan-400 font-medium">{senderName}</span>
                    )}
                  </div>

                  <div
                    className={`chat-bubble ${
                      isOwn
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg h-48 object-cover"
                      />
                    )}
                    {msg.text && <p className="mt-2">{msg.text}</p>}
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <MessageInput onSend={sendGroupMessage} />
    </>
  );
}

export default GroupChatContainer;

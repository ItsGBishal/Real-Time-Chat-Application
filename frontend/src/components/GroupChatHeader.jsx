import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { XIcon, UsersIcon } from "lucide-react";

function GroupChatHeader() {
  const { selectedGroup, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedGroup(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setSelectedGroup]);

  if (!selectedGroup) return null;

  const onlineCount = selectedGroup.members?.filter((m) =>
    onlineUsers.includes(m._id)
  ).length || 0;

  const memberCount = selectedGroup.members?.length || 0;

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3 py-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          {selectedGroup.groupPic ? (
            <img
              src={selectedGroup.groupPic}
              alt={selectedGroup.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <UsersIcon className="w-6 h-6 text-white" />
          )}
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedGroup.name}</h3>
          <p className="text-slate-400 text-sm">
            {memberCount} member{memberCount !== 1 ? "s" : ""} •{" "}
            <span className="text-green-400">{onlineCount} online</span>
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedGroup(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default GroupChatHeader;

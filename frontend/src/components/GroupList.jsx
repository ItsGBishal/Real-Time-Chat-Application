import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import { PlusIcon, UsersIcon } from "lucide-react";

function GroupList() {
  const {
    groups,
    isGroupsLoading,
    fetchMyGroups,
    setSelectedGroup,
    selectedGroup,
    getAllContacts,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyGroups();
    getAllContacts();
  }, [fetchMyGroups, getAllContacts]);

  if (isGroupsLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 mb-2 rounded-lg border border-dashed border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors text-sm font-medium"
      >
        <PlusIcon className="w-4 h-4" />
        New Group
      </button>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
          <UsersIcon className="w-10 h-10 text-slate-600" />
          <p className="text-slate-500 text-sm">No groups yet.</p>
          <p className="text-slate-600 text-xs">Create one to get started!</p>
        </div>
      ) : (
        <>
          {groups.map((group) => {
            const isActive = selectedGroup?._id === group._id;
            const onlineCount = group.members?.filter((m) =>
              onlineUsers.includes(m._id)
            ).length || 0;

            return (
              <div
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 border border-cyan-500/30"
                    : "bg-cyan-500/10 hover:bg-cyan-500/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {group.groupPic ? (
                      <img
                        src={group.groupPic}
                        alt={group.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <UsersIcon className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-200 font-medium truncate">{group.name}</h4>
                    <p className="text-slate-500 text-xs">
                      {group.members?.length || 0} members
                      {onlineCount > 0 && (
                        <span className="text-green-400 ml-1">• {onlineCount} online</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default GroupList;

import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { XIcon, UsersIcon, PlusIcon, SearchIcon } from "lucide-react";

function CreateGroupModal({ onClose }) {
  const { allContacts, createGroup } = useChatStore();
  const { authUser } = useAuthStore();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const filtered = (allContacts || []).filter((c) =>
    (c.fullName || "").toLowerCase().includes((search || "").toLowerCase())
  );

  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    if (selectedIds.length < 1) {
      return;
    }

    setIsCreating(true);
    const group = await createGroup({
      name: groupName.trim(),
      description: description.trim(),
      memberIds: selectedIds,
    });
    setIsCreating(false);

    if (group) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-slate-200 font-semibold text-lg">New Group</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-5 space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Group Name *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Team Alpha"
              maxLength={100}
              required
              className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-2 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              maxLength={300}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-2 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">
              Add Members{" "}
              <span className="text-cyan-400">({selectedIds.length} selected)</span>
            </label>
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full bg-slate-800/70 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No contacts found</p>
              )}
              {filtered.map((contact) => {
                const isSelected = selectedIds.includes(contact._id);
                return (
                  <button
                    type="button"
                    key={contact._id}
                    onClick={() => toggleMember(contact._id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                      isSelected
                        ? "bg-cyan-500/20 border border-cyan-500/40"
                        : "hover:bg-slate-800"
                    }`}
                  >
                    <img
                      src={contact.profilePic || "/avatar.png"}
                      alt={contact.fullName || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-slate-200 text-sm font-medium flex-1 truncate">
                      {contact.fullName || "Unknown User"}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-500"
                          : "border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !groupName.trim() || selectedIds.length === 0}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isCreating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )}
              {isCreating ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;

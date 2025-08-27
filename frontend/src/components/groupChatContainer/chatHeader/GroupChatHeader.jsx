// GroupChatHeader.jsx
import { X, Users, LinkIcon } from "lucide-react";
import { useGroupChatStore } from "../../../store/useGroupChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useGroupsStore } from "../../../store/useGroupsStore";
import { useState } from "react";
import AddMembersModal from "./AddMembersModal";
import toast from "react-hot-toast";

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();
  const { authUser } = useAuthStore();
  const { getInviteLink } = useGroupsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!selectedGroup) return null;

  const isAdmin = selectedGroup.members?.some(
  (m) =>
    (m.userId?._id === authUser._id || m.userId === authUser._id) &&
    m.role === "admin"
);


  const handleCopyLink = async () => {
    try {
      const link = await getInviteLink(selectedGroup._id);
      if (!link) throw new Error("No invite link found");
      await navigator.clipboard.writeText(link);
      toast.success("Invite link copied!");
    } catch (err) {
      toast.error(err.message || "Failed to copy link");
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Group Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedGroup.groupPicture}
                alt={selectedGroup.name}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedGroup.name}</h3>
            <p className="text-sm text-gray-400">
              {selectedGroup.members?.length || 0} members
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          {isAdmin && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-ghost btn-sm"
              >
                <Users className="w-4 h-4 mr-1" /> Add
              </button>

              <button
                onClick={handleCopyLink}
                className="btn btn-ghost btn-sm"
              >
                <LinkIcon className="w-4 h-4 mr-1" /> Copy Link
              </button>
            </>
          )}

          <button
            onClick={() => setSelectedGroup(null)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal لإضافة الأعضاء */}
      {isModalOpen && (
        <AddMembersModal
          groupId={selectedGroup._id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GroupChatHeader;

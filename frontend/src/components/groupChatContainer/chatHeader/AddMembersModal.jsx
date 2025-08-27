import { useEffect, useState } from "react";
import { useFriendsStore } from "../../../store/useFriendsStore";
import { useGroupsStore } from "../../../store/useGroupsStore";

const AddMembersModal = ({ groupId, onClose }) => {
  const { friends, getFriends } = useFriendsStore();
  const { groups, addMembers } = useGroupsStore(); // 👈 نجيب الجروبات
  const [selected, setSelected] = useState([]);

  const group = groups.find((g) => g._id === groupId); // 👈 نحدد الجروب الحالي

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    await addMembers(groupId, selected);
    onClose();
  };

  // 👇 فلترة الأصدقاء: استبعد أي حد أصلاً عضو في الجروب
  const availableFriends = friends.filter(
    (f) => !group?.members.some((m) => m.userId === f._id)
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-base-100 p-5 rounded-xl w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-bold text-lg mb-3">Add Members</h2>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {availableFriends.map((f) => (
            <div
              key={f._id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center gap-2">
                <img
                  src={
                    f.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={`${f.firstName} ${f.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>
                  {f.firstName} {f.lastName}
                </span>
              </div>
              <input
                type="checkbox"
                checked={selected.includes(f._id)}
                onChange={() => toggleSelect(f._id)}
              />
            </div>
          ))}

          {!availableFriends.length && (
            <p className="text-sm text-center text-gray-500">
              All your friends are already in this group.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!selected.length}
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};


export default AddMembersModal;
